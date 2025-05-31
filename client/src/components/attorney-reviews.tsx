import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, Shield, Calendar, User } from "lucide-react";
import { AttorneyReview } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface AttorneyReviewsProps {
  attorneyId: number;
}

export default function AttorneyReviews({ attorneyId }: AttorneyReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: [`/api/attorneys/${attorneyId}/reviews`],
  });

  const { data: verifiedReviews = [] } = useQuery({
    queryKey: [`/api/attorneys/${attorneyId}/verified-reviews`],
  });

  const helpfulMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      await apiRequest("POST", `/api/reviews/${reviewId}/helpful`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/attorneys/${attorneyId}/reviews`]
      });
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const calculateAverageRating = (reviews: AttorneyReview[]) => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((total / reviews.length) * 10) / 10;
  };

  const getRatingDistribution = (reviews: AttorneyReview[]) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const averageRating = calculateAverageRating(reviews);
  const distribution = getRatingDistribution(reviews);
  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Client Reviews</span>
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(Math.round(averageRating))}</div>
            <span className="font-medium">{averageRating}</span>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Distribution */}
        <div className="space-y-2">
          {Object.entries(distribution)
            .reverse()
            .map(([rating, count]) => (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-6">{rating}★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{
                      width: `${reviews.length > 0 ? (count / reviews.length) * 100 : 0}%`
                    }}
                  />
                </div>
                <span className="w-8 text-gray-500">{count}</span>
              </div>
            ))}
        </div>

        {/* Verified Reviews Count */}
        {verifiedReviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
            <Shield className="h-4 w-4" />
            <span>{verifiedReviews.length} verified client reviews</span>
          </div>
        )}

        {/* Individual Reviews */}
        <div className="space-y-4">
          {displayedReviews.map((review: AttorneyReview) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(review.rating)}</div>
                  {review.isVerifiedClient && (
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Client
                    </Badge>
                  )}
                  {review.isAnonymous && (
                    <Badge variant="outline" className="text-xs">
                      Anonymous
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {new Date(review.createdAt!).toLocaleDateString()}
                </div>
              </div>

              {review.reviewTitle && (
                <h4 className="font-medium mb-1">{review.reviewTitle}</h4>
              )}

              {review.reviewText && (
                <p className="text-gray-700 mb-3">{review.reviewText}</p>
              )}

              {/* Detailed Ratings */}
              {(review.communicationRating || review.expertiseRating || 
                review.responsivenessRating || review.valueRating) && (
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  {review.communicationRating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Communication:</span>
                      <div className="flex">{renderStars(review.communicationRating)}</div>
                    </div>
                  )}
                  {review.expertiseRating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expertise:</span>
                      <div className="flex">{renderStars(review.expertiseRating)}</div>
                    </div>
                  )}
                  {review.responsivenessRating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Responsiveness:</span>
                      <div className="flex">{renderStars(review.responsivenessRating)}</div>
                    </div>
                  )}
                  {review.valueRating && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Value:</span>
                      <div className="flex">{renderStars(review.valueRating)}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Helpful Button */}
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => helpfulMutation.mutate(review.id)}
                  disabled={helpfulMutation.isPending}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <ThumbsUp className="h-3 w-3 mr-1" />
                  Helpful ({review.helpfulVotes})
                </Button>
                {review.status === 'approved' && (
                  <Badge variant="outline" className="text-xs">
                    Verified Review
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Show More/Less Button */}
        {reviews.length > 3 && (
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="w-full"
          >
            {showAll ? `Show Less` : `Show All ${reviews.length} Reviews`}
          </Button>
        )}

        {reviews.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No reviews yet</p>
            <p className="text-sm">Be the first to review this attorney</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}