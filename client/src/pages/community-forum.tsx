import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  Star,
  Shield,
  Heart,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Pin,
  Reply
} from "lucide-react";
import { Link } from "wouter";

export default function CommunityForum() {
  const forumCategories = [
    {
      icon: Shield,
      title: "Legal Questions",
      description: "Get advice on military legal matters",
      posts: 1247,
      lastPost: "2 hours ago",
      color: "blue",
      topics: ["Court-martial defense", "UCMJ violations", "Administrative actions", "Security clearance issues"]
    },
    {
      icon: Heart,
      title: "Family & Personal",
      description: "Family law, deployment, and personal matters",
      posts: 892,
      lastPost: "1 hour ago",
      color: "pink",
      topics: ["Divorce and custody", "Deployment support", "Family care plans", "Spouse employment"]
    },
    {
      icon: BookOpen,
      title: "Benefits & Claims",
      description: "VA benefits, disability claims, and compensation",
      posts: 1456,
      lastPost: "30 minutes ago",
      color: "green",
      topics: ["Disability ratings", "GI Bill benefits", "VA healthcare", "Claims process"]
    },
    {
      icon: Users,
      title: "Career Transition",
      description: "Job hunting, resume help, and civilian transition",
      posts: 634,
      lastPost: "4 hours ago",
      color: "purple",
      topics: ["Resume building", "Job interviews", "Networking", "Skills translation"]
    }
  ];

  const recentTopics = [
    {
      title: "Court-martial defense - Need advice urgently",
      author: "SgtJohnson",
      branch: "Army",
      replies: 23,
      views: 456,
      lastReply: "15 minutes ago",
      pinned: true,
      urgent: true
    },
    {
      title: "VA disability rating appeal process",
      author: "VetMike2019",
      branch: "Marines",
      replies: 18,
      views: 312,
      lastReply: "1 hour ago",
      pinned: false,
      urgent: false
    },
    {
      title: "Deployment POA documents - what do I need?",
      author: "NavySpouse",
      branch: "Navy",
      replies: 15,
      views: 289,
      lastReply: "2 hours ago",
      pinned: false,
      urgent: false
    },
    {
      title: "Transitioning to civilian career - tech industry",
      author: "AirForceVet",
      branch: "Air Force",
      replies: 31,
      views: 587,
      lastReply: "3 hours ago",
      pinned: false,
      urgent: false
    },
    {
      title: "Child custody during PCS move",
      author: "CoastGuardDad",
      branch: "Coast Guard",
      replies: 12,
      views: 234,
      lastReply: "5 hours ago",
      pinned: false,
      urgent: false
    }
  ];

  const featuredExperts = [
    {
      name: "Attorney Sarah Miller",
      specialty: "Military Family Law",
      posts: 342,
      helpful: 1247,
      rating: 4.9,
      verified: true
    },
    {
      name: "Major (Ret.) David Chen",
      specialty: "Court-martial Defense",
      posts: 198,
      helpful: 892,
      rating: 4.8,
      verified: true
    },
    {
      name: "VA Claims Expert Lisa Rodriguez",
      specialty: "Disability Benefits",
      posts: 267,
      helpful: 1034,
      rating: 4.9,
      verified: true
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
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Community Forum</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Connect with fellow service members, veterans, and military legal experts. 
              Share experiences, get advice, and support each other through legal challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/forum/new-topic">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Start New Discussion
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                Browse All Topics
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Forum Statistics */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12,450</div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4,229</div>
              <div className="text-gray-600">Total Topics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">28,345</div>
              <div className="text-gray-600">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">892</div>
              <div className="text-gray-600">Resolved Cases</div>
            </div>
          </div>
        </div>
      </section>

      {/* Forum Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Forum Categories</h2>
            <p className="text-xl text-gray-600">Find discussions organized by topic and specialty</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {forumCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className={`border-l-4 border-l-${category.color}-500 hover:shadow-lg transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-${category.color}-100 rounded-full flex items-center justify-center`}>
                          <IconComponent className={`w-6 h-6 text-${category.color}-600`} />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{category.title}</CardTitle>
                          <p className="text-gray-600 text-sm">{category.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{category.posts}</div>
                        <div className="text-xs text-gray-500">posts</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        Last post: {category.lastPost}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {category.topics.slice(0, 3).map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                        {category.topics.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{category.topics.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Link href={`/forum/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <Button className={`w-full bg-${category.color}-600 hover:bg-${category.color}-700`}>
                        Browse Category
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Topics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Recent Discussions</h2>
            <p className="text-xl text-gray-600">Latest topics and active conversations</p>
          </div>

          <div className="space-y-4">
            {recentTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {topic.pinned && <Pin className="w-4 h-4 text-orange-600" />}
                        {topic.urgent && <AlertCircle className="w-4 h-4 text-red-600" />}
                        <h3 className="text-lg font-semibold text-navy-900 hover:text-blue-600 cursor-pointer">
                          {topic.title}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{topic.author}</span>
                        </div>
                        <Badge className={getBranchColor(topic.branch)}>{topic.branch}</Badge>
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
                          <Clock className="w-4 h-4" />
                          Last reply: {topic.lastReply}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link href={`/forum/topic/${index + 1}`}>
                        <Button size="sm" variant="outline">
                          View Topic
                        </Button>
                      </Link>
                      {topic.urgent && (
                        <Badge variant="destructive" className="text-xs text-center">
                          Urgent
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/forum/all-topics">
              <Button size="lg" variant="outline">
                View All Topics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Experts */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Featured Experts</h2>
            <p className="text-xl text-gray-600">Verified legal professionals and experienced community members</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredExperts.map((expert, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    {expert.verified && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <p className="text-gray-600">{expert.specialty}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-blue-600">{expert.posts}</div>
                      <div className="text-xs text-gray-600">Posts</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">{expert.helpful}</div>
                      <div className="text-xs text-gray-600">Helpful</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-lg font-bold">{expert.rating}</span>
                      </div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                  </div>
                  <Link href={`/forum/expert/${expert.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Button size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Community Guidelines</h2>
          <p className="text-xl mb-8">
            Our forum is a safe space for military members to seek and provide support. 
            Please maintain respectful, helpful, and professional interactions.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h3 className="text-lg font-semibold mb-3">Do:</h3>
              <ul className="space-y-2 text-gray-200">
                <li>• Be respectful and supportive</li>
                <li>• Share relevant experiences</li>
                <li>• Verify information sources</li>
                <li>• Use appropriate topic categories</li>
                <li>• Report inappropriate content</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Don't:</h3>
              <ul className="space-y-2 text-gray-200">
                <li>• Share classified information</li>
                <li>• Provide specific legal advice</li>
                <li>• Use offensive language</li>
                <li>• Spam or advertise</li>
                <li>• Violate privacy</li>
              </ul>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/forum/guidelines">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                Read Full Guidelines
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Join Community */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <MessageSquare className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Join the Conversation</h2>
          <p className="text-xl mb-8">
            Connect with thousands of service members, veterans, and legal professionals 
            who understand your challenges and can offer real support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/forum/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Join Forum
              </Button>
            </Link>
            <Link href="/emergency-consultation">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                Need Urgent Help?
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}