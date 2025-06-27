import crypto from "crypto";

// Generate secure reference for bookings
export function generateSecureReference(prefix: string = "REF"): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Generate meeting link for video consultations
export function generateMeetingLink(reference: string): { link: string; password: string } {
  const baseUrl = process.env.MEETING_BASE_URL || "https://meet.militarylegalshield.com";
  const roomId = crypto.createHash('sha256').update(reference).digest('hex').substring(0, 12);
  const password = crypto.randomBytes(3).toString('hex').toUpperCase();
  
  return {
    link: `${baseUrl}/room/${roomId}`,
    password
  };
}

// Generate secure consultation room
export function generateConsultationRoom(): { roomId: string; accessCode: string } {
  const roomId = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
  const accessCode = crypto.randomBytes(3).toString('hex').toUpperCase();
  
  return { roomId, accessCode };
}

// Validate phone number
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\+?1?[-.\s]?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})$/;
  return phoneRegex.test(phone.replace(/\s+/g, ''));
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+1${cleaned}`;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    return `+${cleaned}`;
  }
  return phone; // Return original if can't format
}

// Calculate time until next available slot
export function calculateNextAvailableSlot(
  currentTime: Date,
  startTime: string,
  endTime: string,
  timezone: string = "America/New_York"
): Date | null {
  const now = new Date(currentTime.toLocaleString("en-US", { timeZone: timezone }));
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const startToday = new Date(now);
  startToday.setHours(startHour, startMinute, 0, 0);
  
  const endToday = new Date(now);
  endToday.setHours(endHour, endMinute, 0, 0);
  
  // If current time is within business hours
  if (now >= startToday && now <= endToday) {
    return now; // Available now
  }
  
  // If current time is before business hours today
  if (now < startToday) {
    return startToday;
  }
  
  // If current time is after business hours, return start time tomorrow
  const startTomorrow = new Date(startToday);
  startTomorrow.setDate(startTomorrow.getDate() + 1);
  return startTomorrow;
}

// Generate emergency notification message
export function generateEmergencyNotification(
  type: 'client' | 'attorney',
  data: {
    reference: string;
    attorneyName?: string;
    clientPhone?: string;
    issueType: string;
    urgencyLevel: string;
    scheduledTime: Date;
  }
): string {
  if (type === 'client') {
    return `Emergency legal consultation confirmed! Reference: ${data.reference}. Attorney ${data.attorneyName} will contact you at ${data.scheduledTime.toLocaleTimeString()}. Issue: ${data.issueType}. Reply STOP to opt out.`;
  } else {
    return `URGENT: Emergency consultation booked. Reference: ${data.reference}. Contact client at ${data.clientPhone} regarding ${data.issueType} (${data.urgencyLevel}). Scheduled: ${data.scheduledTime.toLocaleTimeString()}`;
  }
}

// Calculate consultation fee based on urgency and duration
export function calculateConsultationFee(
  urgencyLevel: string,
  duration: number,
  isEmergencyCredit: boolean = false
): number {
  if (isEmergencyCredit) return 0;
  
  const baseFee = 150; // $1.50 in cents
  const urgencyMultipliers = {
    critical: 3.0,
    urgent: 2.0,
    high: 1.5,
    routine: 1.0
  };
  
  const durationFee = Math.ceil(duration / 30) * baseFee;
  const urgencyMultiplier = urgencyMultipliers[urgencyLevel as keyof typeof urgencyMultipliers] || 1.0;
  
  return Math.round(durationFee * urgencyMultiplier);
}

// Validate business hours
export function isWithinBusinessHours(
  currentTime: Date,
  startTime: string,
  endTime: string,
  timezone: string = "America/New_York"
): boolean {
  const now = new Date(currentTime.toLocaleString("en-US", { timeZone: timezone }));
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const startTimeInMinutes = startHour * 60 + startMinute;
  const endTimeInMinutes = endHour * 60 + endMinute;
  
  return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
}

// Generate tracking URL for booking status
export function generateTrackingUrl(reference: string): string {
  const baseUrl = process.env.APP_BASE_URL || "https://militarylegalshield.com";
  return `${baseUrl}/track-booking/${reference}`;
}

// Sanitize user input for legal descriptions
export function sanitizeLegalDescription(description: string): string {
  return description
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .trim()
    .substring(0, 1000);
}