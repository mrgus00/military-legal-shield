import type { Request, Response } from "express";
import { db } from "./db";
import { 
  emergencyBookings, 
  attorneys, 
  attorneyAvailability,
  insertEmergencyBookingSchema,
  type InsertEmergencyBooking
} from "@shared/schema";
import { eq, and, sql, desc, asc } from "drizzle-orm";
import { twilioService } from "./twilio";
import { analytics } from "./analytics";

// Generate unique booking reference
function generateBookingReference(): string {
  const prefix = "EMG";
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

// Generate meeting link for video consultations
function generateMeetingLink(reference: string): { link: string; password: string } {
  const baseUrl = process.env.MEETING_BASE_URL || "https://meet.militarylegalshield.com";
  const roomId = reference.replace(/[^a-zA-Z0-9]/g, '').substring(0, 12);
  const password = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  return {
    link: `${baseUrl}/room/${roomId}`,
    password
  };
}

// Create emergency booking - One-click system
export async function createEmergencyBooking(req: Request, res: Response) {
  try {
    const bookingData = insertEmergencyBookingSchema.parse(req.body);
    const userId = 1; // Default for testing
    
    // Generate booking reference
    const bookingReference = generateBookingReference();
    
    // Find available attorneys for emergency consultations
    const availableAttorneys = await db
      .select()
      .from(attorneys)
      .where(
        and(
          eq(attorneys.availableForEmergency, true),
          eq(attorneys.isActive, true)
        )
      )
      .limit(5);
    
    if (availableAttorneys.length === 0) {
      return res.status(503).json({ 
        message: "No attorneys available for emergency consultation at this time. Please contact our 24/7 hotline.",
        hotline: "+1-800-MIL-LEGAL"
      });
    }
    
    // Select the first available attorney (in a real system, this would be more sophisticated)
    const selectedAttorney = availableAttorneys[0];
    
    // Calculate scheduled time based on urgency
    const scheduledDateTime = new Date();
    if (bookingData.urgencyLevel === 'critical') {
      scheduledDateTime.setMinutes(scheduledDateTime.getMinutes() + 5);
    } else if (bookingData.urgencyLevel === 'urgent') {
      scheduledDateTime.setMinutes(scheduledDateTime.getMinutes() + 15);
    } else {
      scheduledDateTime.setMinutes(scheduledDateTime.getMinutes() + 30);
    }
    
    // Generate meeting link for video consultations
    let meetingLink = null;
    let meetingPassword = null;
    if (bookingData.preferredContactMethod === 'video') {
      const meetingInfo = generateMeetingLink(bookingReference);
      meetingLink = meetingInfo.link;
      meetingPassword = meetingInfo.password;
    }
    
    // Create the booking
    const [newBooking] = await db
      .insert(emergencyBookings)
      .values({
        userId,
        attorneyId: selectedAttorney.id,
        bookingReference,
        urgencyLevel: bookingData.urgencyLevel,
        issueType: bookingData.issueType,
        briefDescription: bookingData.briefDescription,
        preferredContactMethod: bookingData.preferredContactMethod,
        contactInfo: bookingData.contactInfo,
        scheduledDateTime,
        estimatedDuration: bookingData.estimatedDuration,
        meetingLink,
        meetingPassword,
        status: 'confirmed'
      })
      .returning();
    
    // Send immediate notifications
    try {
      const clientPhone = (bookingData.contactInfo as any).phone;
      const attorneyName = `${selectedAttorney.firstName} ${selectedAttorney.lastName}`;
      
      // Notify client via SMS
      if (clientPhone) {
        await twilioService.sendSMS({
          to: clientPhone,
          message: `Emergency legal consultation confirmed! Reference: ${bookingReference}. Attorney ${attorneyName} will contact you at ${scheduledDateTime.toLocaleTimeString()}. Reply STOP to opt out.`,
          type: 'emergency'
        });
      }
      
      // Notify attorney via SMS
      if (selectedAttorney.phone) {
        await twilioService.sendSMS({
          to: selectedAttorney.phone,
          message: `URGENT: Emergency consultation booked. Reference: ${bookingReference}. Contact client at ${clientPhone} regarding ${bookingData.issueType}. Scheduled: ${scheduledDateTime.toLocaleTimeString()}`,
          type: 'emergency'
        });
      }
    } catch (smsError) {
      console.error("SMS notification failed:", smsError);
      // Continue with booking even if SMS fails
    }
    
    // Track analytics
    analytics.trackEmergencyRequest();
    analytics.trackAttorneyMatch();
    
    const attorneyName = `${selectedAttorney.firstName} ${selectedAttorney.lastName}`;
    
    res.status(201).json({
      success: true,
      booking: newBooking,
      attorney: {
        name: attorneyName,
        firm: selectedAttorney.firmName,
        phone: selectedAttorney.phone,
        email: selectedAttorney.email,
        responseTime: selectedAttorney.responseTime
      },
      scheduledDateTime,
      meetingLink,
      meetingPassword,
      instructions: `Your emergency consultation has been confirmed with ${attorneyName}. They will contact you via ${bookingData.preferredContactMethod} at ${scheduledDateTime.toLocaleTimeString()}.`,
      reference: bookingReference,
      estimatedCost: bookingData.urgencyLevel === 'critical' ? 450 : bookingData.urgencyLevel === 'urgent' ? 300 : 150
    });
    
  } catch (error) {
    console.error("Error creating emergency booking:", error);
    res.status(500).json({ message: "Failed to create emergency booking" });
  }
}

// Get booking status
export async function getBookingStatus(req: Request, res: Response) {
  try {
    const { reference } = req.params;
    
    const booking = await db
      .select({
        booking: emergencyBookings,
        attorney: attorneys
      })
      .from(emergencyBookings)
      .leftJoin(attorneys, eq(emergencyBookings.attorneyId, attorneys.id))
      .where(eq(emergencyBookings.bookingReference, reference))
      .limit(1);
    
    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    const result = booking[0];
    const attorneyName = result.attorney ? `${result.attorney.firstName} ${result.attorney.lastName}` : "Unassigned";
    
    res.json({
      booking: result.booking,
      attorney: result.attorney ? {
        name: attorneyName,
        firm: result.attorney.firmName,
        phone: result.attorney.phone,
        email: result.attorney.email
      } : null
    });
    
  } catch (error) {
    console.error("Error getting booking status:", error);
    res.status(500).json({ message: "Failed to get booking status" });
  }
}

// Update booking status (for attorneys)
export async function updateBookingStatus(req: Request, res: Response) {
  try {
    const { reference } = req.params;
    const { status, notes } = req.body;
    
    const updateData: any = {
      status,
      notes,
      updatedAt: new Date()
    };
    
    if (status === 'in-progress') {
      updateData.connectionTime = new Date();
    } else if (status === 'completed') {
      updateData.completionTime = new Date();
    }
    
    const [updatedBooking] = await db
      .update(emergencyBookings)
      .set(updateData)
      .where(eq(emergencyBookings.bookingReference, reference))
      .returning();
    
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    res.json({ success: true, booking: updatedBooking });
    
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
}

// Get user's emergency bookings
export async function getUserEmergencyBookings(req: Request, res: Response) {
  try {
    const userId = 1; // Default for testing
    
    const userBookings = await db
      .select({
        booking: emergencyBookings,
        attorney: attorneys
      })
      .from(emergencyBookings)
      .leftJoin(attorneys, eq(emergencyBookings.attorneyId, attorneys.id))
      .where(eq(emergencyBookings.userId, userId))
      .orderBy(desc(emergencyBookings.createdAt))
      .limit(20);
    
    res.json({
      bookings: userBookings.map(result => ({
        ...result.booking,
        attorney: result.attorney ? {
          name: `${result.attorney.firstName} ${result.attorney.lastName}`,
          firm: result.attorney.firmName,
          phone: result.attorney.phone,
          email: result.attorney.email
        } : null
      }))
    });
    
  } catch (error) {
    console.error("Error getting user bookings:", error);
    res.status(500).json({ message: "Failed to get user bookings" });
  }
}

// Emergency hotline handler - for critical situations
export async function handleEmergencyHotline(req: Request, res: Response) {
  try {
    const { phone, urgencyLevel, briefMessage } = req.body;
    
    // Log the emergency call
    console.log(`EMERGENCY HOTLINE CALL: ${phone} - ${urgencyLevel} - ${briefMessage}`);
    
    // Send immediate response SMS
    if (phone) {
      await twilioService.sendSMS({
        to: phone,
        message: "Emergency hotline activated. A legal representative will call you within 5 minutes. If this is a life-threatening emergency, call 911 immediately.",
        type: 'emergency'
      });
    }
    
    // Alert on-duty attorney
    const onDutyAttorneys = await db
      .select()
      .from(attorneys)
      .where(
        and(
          eq(attorneys.availableForEmergency, true),
          eq(attorneys.isActive, true)
        )
      )
      .limit(1);
    
    if (onDutyAttorneys.length > 0 && onDutyAttorneys[0].phone) {
      await twilioService.sendSMS({
        to: onDutyAttorneys[0].phone,
        message: `CRITICAL: Emergency hotline call from ${phone}. Message: ${briefMessage}. Call immediately.`,
        type: 'emergency'
      });
    }
    
    res.json({
      success: true,
      message: "Emergency hotline activated. Help is on the way.",
      estimatedResponseTime: "5 minutes"
    });
    
  } catch (error) {
    console.error("Error handling emergency hotline:", error);
    res.status(500).json({ message: "Emergency hotline error" });
  }
}

// Get available emergency attorneys (for frontend display)
export async function getAvailableEmergencyAttorneys(req: Request, res: Response) {
  try {
    const availableAttorneys = await db
      .select()
      .from(attorneys)
      .where(
        and(
          eq(attorneys.availableForEmergency, true),
          eq(attorneys.isActive, true)
        )
      )
      .limit(10);
    
    res.json({
      attorneys: availableAttorneys.map(attorney => ({
        id: attorney.id,
        name: `${attorney.firstName} ${attorney.lastName}`,
        firm: attorney.firmName,
        specialties: attorney.specialties,
        location: attorney.location,
        responseTime: attorney.responseTime,
        isAvailable: true
      }))
    });
    
  } catch (error) {
    console.error("Error getting available attorneys:", error);
    res.status(500).json({ message: "Failed to get available attorneys" });
  }
}