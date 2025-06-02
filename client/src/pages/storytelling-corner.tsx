import { useState, useRef, useEffect } from "react";
import { useMood } from "@/contexts/MoodContext";
import MoodIndicator from "@/components/mood-indicator";
import MoodAwareCard from "@/components/mood-aware-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  Play, 
  Pause, 
  Mic, 
  Video, 
  Upload, 
  Share2, 
  MessageCircle, 
  Calendar,
  MapPin,
  Award,
  Users,
  Volume2,
  Camera,
  FileText,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Story {
  id: number;
  title: string;
  authorName: string;
  authorBranch: string;
  authorRank: string;
  content: string;
  mediaType: "text" | "audio" | "video";
  mediaUrl?: string;
  category: string;
  location?: string;
  timeframe: string;
  likes: number;
  comments: number;
  views: number;
  tags: string[];
  createdAt: string;
  isAnonymous: boolean;
}

export default function StorytellingCorner() {
  const { setMood, colors } = useMood();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingType, setRecordingType] = useState<"audio" | "video" | null>(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Set hopeful mood for storytelling
  useEffect(() => {
    setMood("hopeful");
  }, [setMood]);

  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ["/api/stories"],
  });

  const submitStoryMutation = useMutation({
    mutationFn: async (storyData: FormData) => {
      return apiRequest("POST", "/api/stories", storyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      toast({
        title: "Story Shared Successfully",
        description: "Thank you for sharing your experience with the community.",
      });
      setShowSubmissionForm(false);
    },
    onError: () => {
      toast({
        title: "Error Sharing Story",
        description: "There was an issue uploading your story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const categories = [
    "all",
    "deployment",
    "transition",
    "leadership",
    "camaraderie", 
    "challenges",
    "achievements",
    "training",
    "family"
  ];

  const filteredStories = selectedCategory === "all" 
    ? stories 
    : stories.filter(story => story.category === selectedCategory);

  const startRecording = async (type: "audio" | "video") => {
    try {
      const constraints = type === "audio" 
        ? { audio: true } 
        : { audio: true, video: true };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { 
          type: type === "audio" ? "audio/wav" : "video/mp4" 
        });
        const url = URL.createObjectURL(blob);
        
        if (type === "audio" && audioRef.current) {
          audioRef.current.src = url;
        } else if (type === "video" && videoRef.current) {
          videoRef.current.src = url;
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingType(type);
      
      toast({
        title: `${type === "audio" ? "Audio" : "Video"} Recording Started`,
        description: `Recording your ${type} story...`,
      });
    } catch (error) {
      toast({
        title: "Recording Permission Required",
        description: "Please allow access to your microphone and camera to record stories.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingType(null);
      
      toast({
        title: "Recording Completed",
        description: "Your story has been recorded successfully.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      {/* Mood Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <MoodIndicator />
      </div>

      {/* Header */}
      <div className="py-12" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <Heart className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Veterans' Storytelling Corner</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Share your military experiences, preserve memories, and connect with fellow veterans through powerful storytelling
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Story Submission Section */}
        <div className="mb-12">
          <MoodAwareCard priority="high" title="Share Your Story">
            <div className="space-y-4">
              <p className="opacity-75">
                Your experiences matter. Share your military journey to inspire others and preserve important memories for future generations.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Dialog open={showSubmissionForm} onOpenChange={setShowSubmissionForm}>
                  <DialogTrigger asChild>
                    <Button style={{ backgroundColor: colors.primary }}>
                      <FileText className="w-4 h-4 mr-2" />
                      Write Story
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Share Your Story</DialogTitle>
                    </DialogHeader>
                    <StorySubmissionForm onSubmit={submitStoryMutation.mutate} />
                  </DialogContent>
                </Dialog>

                <Button 
                  variant="outline"
                  onClick={() => startRecording("audio")}
                  disabled={isRecording}
                  style={{ borderColor: colors.border }}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Record Audio
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => startRecording("video")}
                  disabled={isRecording}
                  style={{ borderColor: colors.border }}
                >
                  <Video className="w-4 h-4 mr-2" />
                  Record Video
                </Button>

                {isRecording && (
                  <Button 
                    onClick={stopRecording}
                    variant="destructive"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Stop Recording
                  </Button>
                )}
              </div>

              {/* Recording Preview */}
              {recordingType && (
                <div className="mt-4 p-4 border rounded-lg" style={{ borderColor: colors.border }}>
                  <h4 className="font-semibold mb-2">Recording Preview</h4>
                  {recordingType === "audio" ? (
                    <audio ref={audioRef} controls className="w-full" />
                  ) : (
                    <video ref={videoRef} controls className="w-full max-h-64" />
                  )}
                </div>
              )}
            </div>
          </MoodAwareCard>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Label className="font-semibold" style={{ color: colors.text }}>
              Filter by Category:
            </Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="space-y-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </div>
              </Card>
            ))
          ) : (
            filteredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))
          )}
        </div>

        {filteredStories.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" style={{ color: colors.primary }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
              No Stories Yet
            </h3>
            <p className="opacity-75">
              Be the first to share a story in this category and inspire others.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StoryCard({ story }: { story: Story }) {
  const { colors } = useMood();
  const [isPlaying, setIsPlaying] = useState(false);

  const getMediaIcon = () => {
    switch (story.mediaType) {
      case "audio": return <Volume2 className="w-4 h-4" />;
      case "video": return <Camera className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <MoodAwareCard priority="normal">
      <div className="space-y-4">
        {/* Story Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
            <div className="flex items-center space-x-4 text-sm opacity-75">
              <span>
                {story.isAnonymous ? "Anonymous Veteran" : story.authorName}
                {!story.isAnonymous && (
                  <>
                    {" • "}
                    <Badge variant="outline" className="text-xs">
                      {story.authorRank} • {story.authorBranch}
                    </Badge>
                  </>
                )}
              </span>
              <span>{formatDate(story.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getMediaIcon()}
            <Badge 
              variant="outline" 
              style={{ borderColor: colors.border }}
            >
              {story.category}
            </Badge>
          </div>
        </div>

        {/* Story Content */}
        <div className="space-y-3">
          {story.location && (
            <div className="flex items-center text-sm opacity-75">
              <MapPin className="w-4 h-4 mr-1" />
              {story.location} • {story.timeframe}
            </div>
          )}
          
          <p className="leading-relaxed">{story.content}</p>
          
          {/* Media Player */}
          {story.mediaUrl && (
            <div className="bg-gray-50 rounded-lg p-4">
              {story.mediaType === "audio" ? (
                <audio controls className="w-full">
                  <source src={story.mediaUrl} type="audio/mpeg" />
                  Your browser does not support audio playback.
                </audio>
              ) : story.mediaType === "video" ? (
                <video controls className="w-full max-h-64 rounded">
                  <source src={story.mediaUrl} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              ) : null}
            </div>
          )}
        </div>

        {/* Tags */}
        {story.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="text-xs"
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Story Engagement */}
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: colors.border }}>
          <div className="flex items-center space-x-6 text-sm opacity-75">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{story.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{story.comments}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{story.views}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Heart className="w-4 h-4 mr-1" />
              Like
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="w-4 h-4 mr-1" />
              Comment
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </MoodAwareCard>
  );
}

function StorySubmissionForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    location: "",
    timeframe: "",
    tags: "",
    isAnonymous: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      submitData.append(key, value.toString());
    });
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Story Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Give your story a meaningful title"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deployment">Deployment</SelectItem>
            <SelectItem value="transition">Transition</SelectItem>
            <SelectItem value="leadership">Leadership</SelectItem>
            <SelectItem value="camaraderie">Camaraderie</SelectItem>
            <SelectItem value="challenges">Challenges</SelectItem>
            <SelectItem value="achievements">Achievements</SelectItem>
            <SelectItem value="training">Training</SelectItem>
            <SelectItem value="family">Family</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location (Optional)</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Where did this happen?"
          />
        </div>
        <div>
          <Label htmlFor="timeframe">Time Period</Label>
          <Input
            id="timeframe"
            value={formData.timeframe}
            onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
            placeholder="e.g., 2015-2018, During deployment"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="content">Your Story</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Share your experience, lessons learned, or memorable moments..."
          rows={6}
          required
        />
      </div>

      <div>
        <Label htmlFor="tags">Tags (Optional)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
          placeholder="Separate tags with commas (e.g., Afghanistan, leadership, brotherhood)"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="anonymous"
          checked={formData.isAnonymous}
          onChange={(e) => setFormData(prev => ({ ...prev, isAnonymous: e.target.checked }))}
        />
        <Label htmlFor="anonymous">Share anonymously</Label>
      </div>

      <Button type="submit" className="w-full">
        Share Your Story
      </Button>
    </form>
  );
}