import type { Request, Response } from "express";
import { db } from "./db";
import { 
  emergencyBookings, 
  attorneys, 
  attorneyAvailability,
  insertEmergencyBookingSchema,
  type InsertEmergencyBooking,
  type EmergencyBooking
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

// Calculate urgency score for attorney matching
function calculateUrgencyScore(urgencyLevel: string, issueType: string): number {
  const urgencyScores = {
    critical: 100,
    urgent: 75,
    high: 50,
    routine: 25
  };
  
  const issueScores = {
    'court-martial': 25,
    'security-clearance': 20,
    'administrative-action': 15,
    'meb-peb': 20,
    'discharge-upgrade': 10,
    'family-law': 15,
    'finance': 10,
    'criminal': 25,
    'other': 5
  };
  
  return (urgencyScores[urgencyLevel as keyof typeof urgencyScores] || 25) + 
         (issueScores[issueType as keyof typeof issueScores] || 5);
}

// Find available emergency attorneys
export async function findAvailableEmergencyAttorneys(req: Request, res: Response) {
  try {
    const { issueType, urgencyLevel, location, preferredContactMethod } = req.query;
    
    const currentTime = new Date();
    const dayOfWeek = currentTime.getDay();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
    
    // Find attorneys available for emergency consultations right now
    const availableAttorneys = await db
      .select({
        attorney: attorneys,
        availability: attorneyAvailability,
        urgencyScore: sql<number>`
          CASE 
            WHEN ${attorneys.specializations} @> ARRAY[${issueType}] THEN 20
            ELSE 0
          END +
          CASE 
            WHEN ${attorneys.location} ILIKE ${`%${location}%`} THEN 15
            ELSE 0
          END +
          CASE 
            WHEN ${attorneys.communicationMethods} @> ARRAY[${preferredContactMethod}] THEN 10
            ELSE 0
          END +
          (100 - ${attorneyAvailability.currentEmergencyBookings} * 10)
        `
      })
      .from(attorneys)
      .innerJoin(attorneyAvailability, eq(attorneys.id, attorneyAvailability.attorneyId))
      .where(
        and(
          eq(attorneyAvailability.dayOfWeek, dayOfWeek),
          eq(attorneyAvailability.isEmergencyAvailable, true),
          eq(attorneyAvailability.isActive, true),
          eq(attorneys.isActive, true),
          sql`${attorneyAvailability.startTime} <= ${timeString}`,
          sql`${attorneyAvailability.endTime} >= ${timeString}`,
          sql`${attorneyAvailability.currentEmergencyBookings} < ${attorneyAvailability.maxDailyEmergencyBookings}`
        )
      )
      .orderBy(desc(sql`urgency_score`), asc(attorneyAvailability.emergencyResponseTime))
      .limit(10);
    
    res.json({
      availableAttorneys: availableAttorneys.map(result => ({
        ...result.attorney,
        availability: result.availability,
        urgencyScore: result.urgencyScore,
        estimatedResponseTime: result.availability.emergencyResponseTime
      }))
    });
    
  } catch (error) {
    console.error("Error finding available attorneys:", error);
    res.status(500).json({ message: "Failed to find available attorneys" });
  }
}

// Create emergency booking - One-click system
export async function createEmergencyBooking(req: Request, res: Response) {
  try {
    const bookingData = insertEmergencyBookingSchema.parse(req.body);
    const userId = req.user?.id || 1; // Default for testing
    
    // Generate booking reference
    const bookingReference = generateBookingReference();
    
    // Calculate urgency score for attorney matching
    const urgencyScore = calculateUrgencyScore(bookingData.urgencyLevel, bookingData.issueType);
    
    // Find best available attorney
    const availableAttorneys = await db
      .select({
        attorney: attorneys,
        availability: attorneyAvailability
      })
      .from(attorneys)
      .innerJoin(attorneyAvailability, eq(attorneys.id, attorneyAvailability.attorneyId))
      .where(
        and(
          eq(attorneyAvailability.isEmergencyAvailable, true),
          eq(attorneyAvailability.isActive, true),
          eq(attorneys.isActive, true),
          sql`${attorneyAvailability.currentEmergencyBookings} < ${attorneyAvailability.maxDailyEmergencyBookings}`
        )
      )
      .orderBy(asc(attorneyAvailability.emergencyResponseTime))
      .limit(1);
    
    if (availableAttorneys.length === 0) {
      return res.status(503).json({ 
        message: "No attorneys available for emergency consultation at this time. Please try again in a few minutes or contact our 24/7 hotline.",
        hotline: "+1-800-MIL-LEGAL"
      });
    }
    
    const selectedAttorney = availableAttorneys[0];
    
    // Calculate scheduled time (immediate for critical/urgent, within response time for others)
    const scheduledDateTime = new Date();
    if (bookingData.urgencyLevel === 'critical') {
      scheduledDateTime.setMinutes(scheduledDateTime.getMinutes() + 5);
    } else if (bookingData.urgencyLevel === 'urgent') {
      scheduledDateTime.setMinutes(scheduledDateTime.getMinutes() + 10);
    } else {
      scheduledDateTime.setMinutes(scheduledDateTime.getMinutes() + selectedAttorney.availability.emergencyResponseTime);
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
        attorneyId: selectedAttorney.attorney.id,
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
    
    // Update attorney's current booking count
    await db
      .update(attorneyAvailability)
      .set({
        currentEmergencyBookings: sql`${attorneyAvailability.currentEmergencyBookings} + 1`,
        updatedAt: new Date()
      })
      .where(eq(attorneyAvailability.attorneyId, selectedAttorney.attorney.id));
    
    // Send immediate notifications
    try {
      // Notify user via SMS
      await twilioService.sendSMS(
        bookingData.contactInfo.phone,
        `Emergency legal consultation confirmed! Reference: ${bookingReference}. Attorney ${selectedAttorney.attorney.name} will contact you at ${scheduledDateTime.toLocaleTimeString()}. Reply STOP to opt out.`
      );
      
      // Notify attorney via SMS
      await twilioService.sendSMS(
        selectedAttorney.attorney.phone || selectedAttorney.attorney.emergencyContact,
        `URGENT: Emergency consultation booked. Reference: ${bookingReference}. Contact client at ${bookingData.contactInfo.phone} regarding ${bookingData.issueType}. Scheduled: ${scheduledDateTime.toLocaleTimeString()}`
      );
    } catch (smsError) {
      console.error("SMS notification failed:", smsError);
      // Continue with booking even if SMS fails
    }
    
    // Track analytics
    analytics.trackEmergencyRequest();
    analytics.trackAttorneyMatch();
    
    res.status(201).json({
      success: true,
      booking: newBooking,
      attorney: {
        name: selectedAttorney.attorney.name,
        firm: selectedAttorney.attorney.firm,
        phone: selectedAttorney.attorney.phone,
        email: selectedAttorney.attorney.email,
        responseTime: selectedAttorney.availability.emergencyResponseTime
      },
      scheduledDateTime,
      meetingLink,
      meetingPassword,
      instructions: `Your emergency consultation has been confirmed with ${selectedAttorney.attorney.name}. They will contact you via ${bookingData.preferredContactMethod} at ${scheduledDateTime.toLocaleTimeString()}.`,
      reference: bookingReference
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
    
    res.json({
      booking: booking[0].booking,
      attorney: booking[0].attorney
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
    
    const [updatedBooking] = await db
      .update(emergencyBookings)
      .set({
        status,
        notes,
        updatedAt: new Date(),
        ...(status === 'in-progress' && { connectionTime: new Date() }),
        ...(status === 'completed' && { completionTime: new Date() })
      })
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
    const userId = req.user?.id || 1;
    
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
        attorney: result.attorney
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
    await twilioService.sendSMS(
      phone,
      "Emergency hotline activated. A legal representative will call you within 5 minutes. If this is a life-threatening emergency, call 911 immediately."
    );
    
    // Alert on-duty attorney
    const onDutyAttorneys = await db
      .select()
      .from(attorneys)
      .innerJoin(attorneyAvailability, eq(attorneys.id, attorneyAvailability.attorneyId))
      .where(eq(attorneyAvailability.isEmergencyAvailable, true))
      .limit(1);
    
    if (onDutyAttorneys.length > 0) {
      await twilioService.sendSMS(
        onDutyAttorneys[0].attorneys.emergencyContact,
        `CRITICAL: Emergency hotline call from ${phone}. Message: ${briefMessage}. Call immediately.`
      );
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