import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  MessageSquare, 
  Users, 
  Clock, 
  TrendingUp,
  Pin,
  AlertCircle,
  Reply,
  ThumbsUp
} from "lucide-react";
import { Link, useParams } from "wouter";

export default function ForumCategory() {
  const { category } = useParams();
  
  const categoryData = {
    "legal-questions": {
      title: "Legal Questions",
      description: "Get advice on military legal matters",
      color: "blue",
      posts: 1247,
      members: 3456
    },
    "family-personal": {
      title: "Family & Personal",
      description: "Family law, deployment, and personal matters",
      color: "pink",
      posts: 892,
      members: 2134
    },
    "benefits-claims": {
      title: "Benefits & Claims",
      description: "VA benefits, disability claims, and compensation",
      color: "green",
      posts: 1456,
      members: 4123
    },
    "career-transition": {
      title: "Career Transition",
      description: "Job hunting, resume help, and civilian transition",
      color: "purple",
      posts: 634,
      members: 1789
    }
  };

  const currentCategory = categoryData[category as keyof typeof categoryData] || categoryData["legal-questions"];

  const topics = [
    {
      id: 1,
      title: "Court-martial defense - Need advice urgently",
      author: "SgtJohnson",
      branch: "Army",
      replies: 23,
      views: 456,
      lastReply: "15 minutes ago",
      pinned: true,
      urgent: true,
      likes: 12
    },
    {
      id: 2,
      title: "VA disability rating appeal process",
      author: "VetMike2019",
      branch: "Marines",
      replies: 18,
      views: 312,
      lastReply: "1 hour ago",
      pinned: false,
      urgent: false,
      likes: 8
    },
    {
      id: 3,
      title: "Deployment POA documents - what do I need?",
      author: "NavySpouse",
      branch: "Navy",
      replies: 15,
      views: 289,
      lastReply: "2 hours ago",
      pinned: false,
      urgent: false,
      likes: 6
    },
    {
      id: 4,
      title: "Child custody during PCS move",
      author: "CoastGuardDad",
      branch: "Coast Guard",
      replies: 12,
      views: 234,
      lastReply: "5 hours ago",
      pinned: false,
      urgent: false,
      likes: 4
    }
  ];

  const getBranchColor = (branch: string) => {
    switch (branch.toLowerCase()) {
      case "army": return "bg-green-100 text-green-800";
      case "navy": return "bg-blue-100 text-blue-800";
      case "air force": return "bg-sky-100 text-sky-800";
      case "marines": return "bg-red-100 text-red-800";
      case "coast guard": return "bg-orange-100 text-orange-800";
      case "space force": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Category Header */}
      <section className="bg-navy-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/community-forum">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-navy-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forum
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{currentCategory.title}</h1>
            <p className="text-xl text-gray-300 mb-6">{currentCategory.description}</p>
            
            <div className="flex justify-center gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold">{currentCategory.posts}</div>
                <div className="text-gray-300">Total Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{currentCategory.members}</div>
                <div className="text-gray-300">Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Actions */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <Button className={`bg-${currentCategory.color}-600 hover:bg-${currentCategory.color}-700`}>
                <MessageSquare className="w-4 h-4 mr-2" />
                New Topic
              </Button>
              <Button variant="outline">
                Subscribe to Category
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option>Latest Activity</option>
                <option>Most Replies</option>
                <option>Most Views</option>
                <option>Newest Topics</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Topics List */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {topics.map((topic) => (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {topic.pinned && <Pin className="w-4 h-4 text-orange-600" />}
                        {topic.urgent && <AlertCircle className="w-4 h-4 text-red-600" />}
                        <Link href={`/forum/topic/${topic.id}`}>
                          <h3 className="text-lg font-semibold text-navy-900 hover:text-blue-600 cursor-pointer">
                            {topic.title}
                          </h3>
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{topic.author}</span>
                        </div>
                        <Badge className={getBranchColor(topic.branch)}>{topic.branch}</Badge>
                        {topic.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Reply className="w-4 h-4" />
                          {topic.replies} replies
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {topic.views} views
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {topic.likes} likes
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Last reply: {topic.lastReply}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={`/forum/topic/${topic.id}`}>
                        <Button size="sm" variant="outline">
                          View Topic
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button size="sm" className="bg-blue-600">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Rules */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-4">Category Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-green-600">Encouraged:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Share relevant experiences</li>
                <li>• Ask specific, detailed questions</li>
                <li>• Provide helpful resources</li>
                <li>• Support fellow service members</li>
                <li>• Use proper topic tags</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-red-600">Not Allowed:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Sharing classified information</li>
                <li>• Personal attacks or harassment</li>
                <li>• Spam or promotional content</li>
                <li>• Off-topic discussions</li>
                <li>• Providing specific legal advice</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}