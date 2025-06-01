import { useState } from "react";
import { Star, Send, Shield, CheckCircle, User, MessageSquare, ThumbsUp } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SecurityReminder from "@/components/security-reminder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Review {
  id: number;
  userName: string;
  userBranch: string;
  rating: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

export default function LeaveReview() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewData, setReviewData] = useState({
    userName: "",
    userBranch: "",
    userEmail: "",
    title: "",
    content: "",
    category: "",
    wouldRecommend: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentReviews, setRecentReviews] = useState<Review[]>([
    {
      id: 1,
      userName: "SGT Martinez",
      userBranch: "Army",
      rating: 5,
      title: "Excellent Legal Guidance",
      content: "The consultation booking system is incredibly efficient. Got connected with a military attorney within hours of my urgent situation. The advice was spot-on and helped resolve my case successfully.",
      category: "Consultation Booking",
      createdAt: "2024-01-15",
      helpful: 24,
      verified: true
    },
    {
      id: 2,
      userName: "PO2 Johnson",
      userBranch: "Navy",
      rating: 5,
      title: "Life-Saving Platform",
      content: "The AI-powered resume builder completely transformed my transition to civilian life. It translated my military experience perfectly and I landed my dream job within 3 weeks!",
      category: "Resume Builder",
      createdAt: "2024-01-12",
      helpful: 18,
      verified: true
    },
    {
      id: 3,
      userName: "SrA Williams",
      userBranch: "Air Force",
      rating: 4,
      title: "Great Resource Hub",
      content: "The legal resources and educational modules are comprehensive and easy to understand. Helped me navigate a complex administrative issue with confidence.",
      category: "Legal Resources",
      createdAt: "2024-01-10",
      helpful: 15,
      verified: true
    }
  ]);

  const { toast } = useToast();

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  const handleSubmitReview = async () => {
    if (!rating || !reviewData.title || !reviewData.content || !reviewData.userName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and provide a rating.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const review = {
        ...reviewData,
        rating,
        createdAt: new Date().toISOString()
      };

      const response = await apiRequest("POST", "/api/reviews", { review });
      
      toast({
        title: "Review Submitted Successfully",
        description: "Thank you for your feedback! Your review helps improve our platform for all military personnel.",
      });

      // Reset form
      setRating(0);
      setReviewData({
        userName: "",
        userBranch: "",
        userEmail: "",
        title: "",
        content: "",
        category: "",
        wouldRecommend: true
      });

    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit your review. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (count: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-6 h-6 cursor-pointer transition-colors ${
          i < count
            ? "text-military-gold-500 fill-current"
            : "text-gray-300"
        } ${interactive ? "hover:text-military-gold-400" : ""}`}
        onClick={interactive ? () => handleRatingClick(i + 1) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
      />
    ));
  };

  const getBranchColor = (branch: string) => {
    const colors = {
      "Army": "bg-green-100 text-green-800",
      "Navy": "bg-blue-100 text-blue-800",
      "Air Force": "bg-sky-100 text-sky-800",
      "Marines": "bg-red-100 text-red-800",
      "Space Force": "bg-purple-100 text-purple-800",
      "Coast Guard": "bg-orange-100 text-orange-800"
    };
    return colors[branch as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Leave a Review
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Share your experience with MilLegal Defense to help us improve our platform and assist fellow service members.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Review Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy-700">
                <MessageSquare className="w-5 h-5" />
                Share Your Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Rating Section */}
              <div className="text-center">
                <Label className="text-lg font-semibold text-navy-700 mb-4 block">
                  Rate Your Overall Experience *
                </Label>
                <div className="flex justify-center space-x-1 mb-2">
                  {renderStars(hoverRating || rating, true)}
                </div>
                <p className="text-sm text-gray-600">
                  {rating === 0 ? "Click to rate" :
                   rating === 1 ? "Poor" :
                   rating === 2 ? "Fair" :
                   rating === 3 ? "Good" :
                   rating === 4 ? "Very Good" :
                   "Excellent"}
                </p>
              </div>

              {/* User Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Name/Rank *</Label>
                  <Input
                    id="userName"
                    value={reviewData.userName}
                    onChange={(e) => setReviewData(prev => ({ ...prev, userName: e.target.value }))}
                    placeholder="e.g., SGT Smith, CPT Johnson"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userBranch">Military Branch *</Label>
                  <Select
                    value={reviewData.userBranch}
                    onValueChange={(value) => setReviewData(prev => ({ ...prev, userBranch: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Army">Army</SelectItem>
                      <SelectItem value="Navy">Navy</SelectItem>
                      <SelectItem value="Air Force">Air Force</SelectItem>
                      <SelectItem value="Marines">Marines</SelectItem>
                      <SelectItem value="Space Force">Space Force</SelectItem>
                      <SelectItem value="Coast Guard">Coast Guard</SelectItem>
                      <SelectItem value="Veteran">Veteran</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userEmail">Email (Optional)</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={reviewData.userEmail}
                  onChange={(e) => setReviewData(prev => ({ ...prev, userEmail: e.target.value }))}
                  placeholder="your.email@example.com"
                />
                <p className="text-xs text-gray-500">
                  Provide email if you'd like us to follow up on your feedback
                </p>
              </div>

              {/* Review Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Review Category</Label>
                <Select
                  value={reviewData.category}
                  onValueChange={(value) => setReviewData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="What feature are you reviewing?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultation Booking">Consultation Booking</SelectItem>
                    <SelectItem value="Legal Resources">Legal Resources</SelectItem>
                    <SelectItem value="Resume Builder">Resume Builder</SelectItem>
                    <SelectItem value="Career Assessment">Career Assessment</SelectItem>
                    <SelectItem value="Financial Planning">Financial Planning</SelectItem>
                    <SelectItem value="Networking Hub">Networking Hub</SelectItem>
                    <SelectItem value="Attorney Directory">Attorney Directory</SelectItem>
                    <SelectItem value="Educational Courses">Educational Courses</SelectItem>
                    <SelectItem value="Overall Platform">Overall Platform</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Review Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Review Title *</Label>
                <Input
                  id="title"
                  value={reviewData.title}
                  onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief summary of your experience"
                  maxLength={100}
                />
              </div>

              {/* Review Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Your Review *</Label>
                <Textarea
                  id="content"
                  value={reviewData.content}
                  onChange={(e) => setReviewData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share details about your experience, what worked well, and any suggestions for improvement..."
                  rows={6}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 text-right">
                  {reviewData.content.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="w-full bg-military-gold-500 hover:bg-military-gold-600 text-white font-semibold py-3"
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Review...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Submit Review</span>
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-navy-700">
                  <ThumbsUp className="w-5 h-5" />
                  Recent Community Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-navy-100 text-navy-600 text-sm">
                              {review.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-sm">{review.userName}</span>
                              <Badge className={getBranchColor(review.userBranch)} variant="outline">
                                {review.userBranch}
                              </Badge>
                              {review.verified && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{review.createdAt}</span>
                      </div>
                      
                      <h4 className="font-semibold text-navy-700 mb-1">{review.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{review.content}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {review.category}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {review.helpful} found this helpful
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Review Guidelines */}
            <Card className="bg-sage-50 border-sage-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sage-800">
                  <Shield className="w-5 h-5" />
                  Review Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-sage-700 space-y-2">
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-600 mt-0.5 flex-shrink-0" />
                    Be honest and specific about your experience
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-600 mt-0.5 flex-shrink-0" />
                    Focus on features and functionality you've used
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-600 mt-0.5 flex-shrink-0" />
                    Maintain OPSEC - avoid sharing sensitive details
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sage-600 mt-0.5 flex-shrink-0" />
                    Be respectful and constructive in feedback
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <SecurityReminder />
      </div>
      <Footer />
    </div>
  );
}