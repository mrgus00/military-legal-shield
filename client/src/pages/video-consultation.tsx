import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  MessageCircle,
  Share2,
  Clock,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoConsultationProps {
  consultationId?: string;
  attorneyName?: string;
  scheduledTime?: string;
  duration?: number;
}

export default function VideoConsultation({ 
  consultationId = "demo-consultation-001", 
  attorneyName = "Lt. Colonel Sarah Martinez (Ret.)", 
  scheduledTime = "2:00 PM EST", 
  duration = 60 
}: VideoConsultationProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'waiting' | 'connecting' | 'connected' | 'ended'>('waiting');
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Initialize video consultation
    initializeVideoCall();
    
    // Start call timer when connected
    let timer: NodeJS.Timeout;
    if (isConnected) {
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isConnected]);

  const initializeVideoCall = async () => {
    try {
      setConnectionStatus('connecting');
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: isVideoEnabled, 
        audio: isAudioEnabled 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Simulate connection delay
      setTimeout(() => {
        setIsConnected(true);
        setConnectionStatus('connected');
        toast({
          title: "Video Consultation Connected",
          description: `Connected with ${attorneyName}`,
        });
      }, 3000);
      
    } catch (error) {
      console.error('Video initialization error:', error);
      toast({
        title: "Camera Access Required",
        description: "Please allow camera and microphone access for video consultation",
        variant: "destructive"
      });
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
  };

  const endCall = () => {
    setConnectionStatus('ended');
    setIsConnected(false);
    
    // Stop all media tracks
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    
    toast({
      title: "Consultation Ended",
      description: "Your video consultation has ended. Follow-up information will be sent via email.",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (connectionStatus === 'ended') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700">Consultation Completed</CardTitle>
            <CardDescription>
              Your video consultation with {attorneyName} has ended
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-medium">{formatDuration(callDuration)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Consultation ID</p>
                <p className="font-medium">{consultationId}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900">Next Steps</h4>
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>Consultation summary will be emailed within 24 hours</li>
                <li>Follow-up scheduling available if needed</li>
                <li>Legal documents discussed will be prepared</li>
                <li>Payment receipt sent to your email</li>
              </ul>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => window.location.href = '/dashboard'}>
                Return to Dashboard
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/schedule-followup'}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Video Consultation with {attorneyName}</CardTitle>
              <CardDescription>
                Scheduled: {scheduledTime} | Duration: {duration} minutes
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
                {connectionStatus === 'waiting' && 'Waiting for attorney'}
                {connectionStatus === 'connecting' && 'Connecting...'}
                {connectionStatus === 'connected' && `Connected • ${formatDuration(callDuration)}`}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Video Interface */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Attorney Video */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{attorneyName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <div className="text-center">
                    <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Waiting for attorney to join...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Client Video */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <VideoOff className="h-12 w-12 opacity-50" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center items-center gap-4">
            <Button
              variant={isVideoEnabled ? "default" : "destructive"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full w-12 h-12 p-0"
            >
              {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isAudioEnabled ? "default" : "destructive"}
              size="lg"
              onClick={toggleAudio}
              className="rounded-full w-12 h-12 p-0"
            >
              {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              onClick={endCall}
              className="rounded-full w-12 h-12 p-0"
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="text-center mt-4 text-sm text-gray-600">
            <p>Your consultation is being recorded for quality assurance and legal documentation purposes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}