import twilio from 'twilio';

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  throw new Error('Missing required Twilio environment variables');
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export interface SMSNotification {
  to: string;
  message: string;
  type: 'emergency' | 'appointment' | 'case_update' | 'general';
}

export interface EmergencyAlert {
  fullName: string;
  rank: string;
  branch: string;
  phoneNumber: string;
  legalIssue: string;
  urgencyLevel: 'critical' | 'high' | 'medium';
  location?: string;
  additionalDetails?: string;
}

export class TwilioService {
  private fromNumber = process.env.TWILIO_PHONE_NUMBER!;

  async sendSMS(notification: SMSNotification): Promise<boolean> {
    try {
      const message = await client.messages.create({
        body: notification.message,
        from: this.fromNumber,
        to: notification.to
      });

      console.log(`SMS sent successfully: ${message.sid}`);
      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  async sendEmergencyAlert(alert: EmergencyAlert): Promise<boolean> {
    const message = this.formatEmergencyMessage(alert);
    
    try {
      // Send to emergency hotline or legal team
      const emergencyNumbers = [
        '+12025551234', // Example emergency legal hotline
        '+18005551234'  // Example military legal assistance
      ];

      const promises = emergencyNumbers.map(number => 
        client.messages.create({
          body: message,
          from: this.fromNumber,
          to: number
        })
      );

      await Promise.all(promises);
      
      // Send confirmation to service member
      await this.sendConfirmationSMS(alert.phoneNumber, alert.fullName);
      
      return true;
    } catch (error) {
      console.error('Failed to send emergency alert:', error);
      return false;
    }
  }

  async sendAppointmentReminder(phoneNumber: string, appointmentDetails: {
    attorneyName: string;
    date: string;
    time: string;
    location: string;
  }): Promise<boolean> {
    const message = `Military Legal Shield Reminder: You have an appointment with ${appointmentDetails.attorneyName} on ${appointmentDetails.date} at ${appointmentDetails.time}. Location: ${appointmentDetails.location}. Reply CONFIRM to acknowledge.`;

    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'appointment'
    });
  }

  async sendCaseUpdate(phoneNumber: string, caseUpdate: {
    caseNumber: string;
    status: string;
    nextSteps: string;
    attorneyName?: string;
  }): Promise<boolean> {
    const message = `Military Legal Shield Update: Case #${caseUpdate.caseNumber} status changed to ${caseUpdate.status}. Next steps: ${caseUpdate.nextSteps}${caseUpdate.attorneyName ? ` Contact: ${caseUpdate.attorneyName}` : ''}`;

    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'case_update'
    });
  }

  async sendWelcomeSMS(phoneNumber: string, serviceMemberName: string): Promise<boolean> {
    const message = `Welcome to Military Legal Shield, ${serviceMemberName}! You now have 24/7 access to legal assistance. For emergencies, visit our urgent match page or call our hotline. Reply STOP to opt out.`;

    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'general'
    });
  }

  async sendSubscriptionConfirmation(phoneNumber: string, planType: string): Promise<boolean> {
    const message = `Military Legal Shield: Your ${planType} subscription is now active! You have full access to our attorney network and legal resources. Questions? Contact support or visit our help center.`;

    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'general'
    });
  }

  private formatEmergencyMessage(alert: EmergencyAlert): string {
    const urgencyEmoji = alert.urgencyLevel === 'critical' ? '🚨 CRITICAL' : 
                        alert.urgencyLevel === 'high' ? '⚠️ HIGH PRIORITY' : 
                        '📢 URGENT';

    return `${urgencyEmoji} MILITARY LEGAL EMERGENCY

Service Member: ${alert.fullName}
Rank/Branch: ${alert.rank}, ${alert.branch}
Phone: ${alert.phoneNumber}
Issue: ${alert.legalIssue}
${alert.location ? `Location: ${alert.location}` : ''}
${alert.additionalDetails ? `Details: ${alert.additionalDetails}` : ''}

Requires immediate legal assistance. Please respond within 30 minutes.`;
  }

  private async sendConfirmationSMS(phoneNumber: string, serviceMemberName: string): Promise<boolean> {
    const message = `${serviceMemberName}, your emergency legal request has been submitted to Military Legal Shield. Our team has been notified and will contact you within 30 minutes. Keep your phone available.`;

    return this.sendSMS({
      to: phoneNumber,
      message,
      type: 'emergency'
    });
  }

  async handleIncomingSMS(from: string, body: string): Promise<string> {
    const normalizedBody = body.toLowerCase().trim();

    if (normalizedBody === 'stop' || normalizedBody === 'unsubscribe') {
      return 'You have been unsubscribed from Military Legal Shield SMS notifications. Text START to resubscribe.';
    }

    if (normalizedBody === 'start' || normalizedBody === 'subscribe') {
      return 'You are now subscribed to Military Legal Shield notifications. Reply STOP to unsubscribe anytime.';
    }

    if (normalizedBody === 'help') {
      return 'Military Legal Shield SMS Help:\n- Reply EMERGENCY for urgent legal assistance\n- Reply STATUS for case updates\n- Reply STOP to unsubscribe\n- Visit militarylegalshield.com';
    }

    if (normalizedBody === 'emergency') {
      return 'For emergency legal assistance, please visit our urgent match page at militarylegalshield.com/urgent-match or call our 24/7 hotline. This ensures fastest response time.';
    }

    if (normalizedBody.includes('confirm')) {
      return 'Thank you for confirming your appointment. We look forward to assisting you with your legal matter.';
    }

    return 'Thank you for contacting Military Legal Shield. For immediate assistance, visit militarylegalshield.com or reply HELP for options.';
  }
}

export const twilioService = new TwilioService();