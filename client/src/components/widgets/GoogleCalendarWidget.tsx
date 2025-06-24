import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CalendarEvent {
  id: string;
  summary: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  location?: string;
  attendees?: Array<{ email: string; displayName?: string }>;
  htmlLink: string;
  description?: string;
}

export default function GoogleCalendarWidget() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration - replace with actual Google Calendar API integration
  const mockEvents: CalendarEvent[] = [
    {
      id: '1',
      summary: 'Legal Consultation - Court Martial Defense',
      start: { dateTime: '2024-06-25T10:00:00-05:00' },
      end: { dateTime: '2024-06-25T11:00:00-05:00' },
      location: 'Video Conference',
      attendees: [{ email: 'attorney@militarylaw.com', displayName: 'Col. Sarah Johnson' }],
      htmlLink: 'https://calendar.google.com/event?eid=abc123',
      description: 'Initial consultation for court martial proceedings'
    },
    {
      id: '2',
      summary: 'Document Review - Power of Attorney',
      start: { dateTime: '2024-06-26T14:00:00-05:00' },
      end: { dateTime: '2024-06-26T15:30:00-05:00' },
      location: 'Fort Liberty JAG Office',
      htmlLink: 'https://calendar.google.com/event?eid=def456',
      description: 'Review and signing of military power of attorney documents'
    },
    {
      id: '3',
      summary: 'VA Benefits Appeal Hearing',
      start: { dateTime: '2024-06-28T09:00:00-05:00' },
      end: { dateTime: '2024-06-28T12:00:00-05:00' },
      location: 'VA Regional Office',
      htmlLink: 'https://calendar.google.com/event?eid=ghi789',
      description: 'Disability benefits appeal hearing'
    }
  ];

  useEffect(() => {
    // Initialize with mock data for demonstration
    setEvents(mockEvents);
    setIsConnected(true);
  }, []);

  const connectToGoogleCalendar = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would initiate OAuth flow
      // For now, we'll simulate connection
      setTimeout(() => {
        setIsConnected(true);
        setEvents(mockEvents);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to connect to Google Calendar');
      setLoading(false);
    }
  };

  const formatEventTime = (event: CalendarEvent) => {
    const startTime = event.start.dateTime || event.start.date;
    if (!startTime) return 'No time specified';
    
    const date = new Date(startTime);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventStatus = (event: CalendarEvent) => {
    const now = new Date();
    const eventStart = new Date(event.start.dateTime || event.start.date || '');
    const eventEnd = new Date(event.end.dateTime || event.end.date || '');
    
    if (now < eventStart) return 'upcoming';
    if (now >= eventStart && now <= eventEnd) return 'ongoing';
    return 'past';
  };

  if (!isConnected) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            Google Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Connect your Google Calendar to view upcoming legal appointments and consultations
            </p>
            <Button 
              onClick={connectToGoogleCalendar}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Connect Google Calendar
                </>
              )}
            </Button>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
            Legal Calendar
          </div>
          <Badge variant="secondary" className="text-xs">
            Connected
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-80 overflow-y-auto space-y-3">
          {events.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">No upcoming legal appointments</p>
            </div>
          ) : (
            events.map((event) => {
              const status = getEventStatus(event);
              return (
                <div
                  key={event.id}
                  className={`border rounded-lg p-3 transition-colors ${
                    status === 'ongoing' 
                      ? 'border-green-200 bg-green-50' 
                      : status === 'upcoming'
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{event.summary}</h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-600">
                        <Clock className="h-3 w-3" />
                        {formatEventTime(event)}
                      </div>
                      {event.location && (
                        <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                      )}
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {event.attendees[0].displayName || event.attendees[0].email}
                            {event.attendees.length > 1 && ` +${event.attendees.length - 1} more`}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {status === 'ongoing' && (
                        <Badge variant="default" className="text-xs bg-green-600">
                          Live
                        </Badge>
                      )}
                      {status === 'upcoming' && (
                        <Badge variant="outline" className="text-xs">
                          Upcoming
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => window.open(event.htmlLink, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => window.open('https://calendar.google.com', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Google Calendar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}