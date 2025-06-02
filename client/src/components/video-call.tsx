import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  MessageSquare,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

interface VideoCallProps {
  attorneyName: string;
  attorneyImage?: string;
  specialty: string;
  onCallEnd?: () => void;
}

interface CallState {
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isCalling: boolean;
  callDuration: number;
  connectionQuality: 'excellent' | 'good' | 'poor';
}

export default function VideoCall({ 
  attorneyName, 
  attorneyImage, 
  specialty, 
  onCallEnd 
}: VideoCallProps) {
  const [callState, setCallState] = useState<CallState>({
    isConnected: false,
    isVideoEnabled: true,
    isAudioEnabled: true,
    isCalling: false,
    callDuration: 0,
    connectionQuality: 'excellent'
  });
  
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const callTimer = useRef<NodeJS.Timeout | null>(null);

  const startCall = async () => {
    try {
      setCallState(prev => ({ ...prev, isCalling: true }));
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStream.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });

      // Add local stream tracks to peer connection
      stream.getTracks().forEach(track => {
        if (peerConnection.current) {
          peerConnection.current.addTrack(track, stream);
        }
      });

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Simulate connection establishment
      setTimeout(() => {
        setCallState(prev => ({ 
          ...prev, 
          isConnected: true, 
          isCalling: false 
        }));
        startCallTimer();
        toast({
          title: "Call Connected",
          description: `Connected to ${attorneyName}`,
        });
      }, 2000);

    } catch (error) {
      console.error('Error starting call:', error);
      toast({
        title: "Call Failed",
        description: "Unable to access camera/microphone. Please check permissions.",
        variant: "destructive"
      });
      setCallState(prev => ({ ...prev, isCalling: false }));
    }
  };

  const endCall = () => {
    // Stop local stream
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    
    // Stop timer
    if (callTimer.current) {
      clearInterval(callTimer.current);
    }
    
    setCallState({
      isConnected: false,
      isVideoEnabled: true,
      isAudioEnabled: true,
      isCalling: false,
      callDuration: 0,
      connectionQuality: 'excellent'
    });
    
    setIsCallDialogOpen(false);
    onCallEnd?.();
    
    toast({
      title: "Call Ended",
      description: "Video call has been disconnected",
    });
  };

  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !callState.isVideoEnabled;
        setCallState(prev => ({ 
          ...prev, 
          isVideoEnabled: !prev.isVideoEnabled 
        }));
      }
    }
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !callState.isAudioEnabled;
        setCallState(prev => ({ 
          ...prev, 
          isAudioEnabled: !prev.isAudioEnabled 
        }));
      }
    }
  };

  const startCallTimer = () => {
    callTimer.current = setInterval(() => {
      setCallState(prev => ({
        ...prev,
        callDuration: prev.callDuration + 1
      }));
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  useEffect(() => {
    return () => {
      if (callTimer.current) {
        clearInterval(callTimer.current);
      }
      if (localStream.current) {
        localStream.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white click-ripple hover-glow transition-smooth"
          onClick={() => setIsCallDialogOpen(true)}
        >
          <Video className="w-4 h-4 mr-2" />
          Video Call
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={attorneyImage} />
                <AvatarFallback>{attorneyName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{attorneyName}</h3>
                <p className="text-sm text-gray-600">{specialty}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {callState.isConnected && (
                <>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {formatDuration(callState.callDuration)}
                  </Badge>
                  <Badge variant="outline" className={getQualityColor(callState.connectionQuality)}>
                    {callState.connectionQuality}
                  </Badge>
                </>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            Secure video consultation with your military law attorney
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 relative bg-black">
          {/* Remote Video (Attorney) */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
            style={{ display: callState.isConnected ? 'block' : 'none' }}
          />
          
          {/* Connection States */}
          {!callState.isConnected && !callState.isCalling && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Connect</h3>
                <p className="text-gray-300 mb-6">Start your secure video consultation</p>
                <Button 
                  onClick={startCall}
                  className="bg-green-600 hover:bg-green-700 text-white click-ripple"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Start Call
                </Button>
              </div>
            </div>
          )}
          
          {callState.isCalling && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="text-center text-white">
                <div className="w-24 h-24 bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Phone className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connecting...</h3>
                <p className="text-gray-300">Please wait while we establish connection</p>
              </div>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          {callState.isConnected && (
            <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ display: callState.isVideoEnabled ? 'block' : 'none' }}
              />
              {!callState.isVideoEnabled && (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <VideoOff className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs">You</Badge>
              </div>
            </div>
          )}
        </div>

        {/* Call Controls */}
        <div className="p-6 bg-white border-t">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant={callState.isAudioEnabled ? "outline" : "destructive"}
              size="lg"
              onClick={toggleAudio}
              className="rounded-full w-12 h-12 p-0 hover-scale transition-smooth"
            >
              {callState.isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </Button>
            
            <Button
              variant={callState.isVideoEnabled ? "outline" : "destructive"}
              size="lg"
              onClick={toggleVideo}
              className="rounded-full w-12 h-12 p-0 hover-scale transition-smooth"
            >
              {callState.isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              onClick={endCall}
              className="rounded-full w-14 h-14 p-0 bg-red-600 hover:bg-red-700 click-ripple"
            >
              <PhoneOff className="w-6 h-6" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12 p-0 hover-scale transition-smooth"
            >
              <MessageSquare className="w-5 h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-12 h-12 p-0 hover-scale transition-smooth"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}