import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft,
  MessageSquare, 
  Users, 
  Clock, 
  ThumbsUp,
  ThumbsDown,
  Share2,
  Flag,
  Pin,
  AlertCircle,
  CheckCircle,
  Quote
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useState } from "react";

export default function ForumTopic() {
  const { topicId } = useParams();
  const [newReply, setNewReply] = useState("");

  const topic = {
    id: topicId,
    title: "Court-martial defense - Need advice urgently",
    author: "SgtJohnson",
    branch: "Army",
    rank: "E-6",
    createdAt: "2 hours ago",
    pinned: true,
    urgent: true,
    views: 456,
    replies: 23,
    likes: 12,
    content: `I'm facing potential court-martial proceedings and need guidance on my rights and next steps. The charges involve Article 86 (Absence without leave) and Article 92 (Failure to obey order or regulation).

Background:
- I was late returning from approved leave due to a family emergency
- My supervisor claims I didn't follow proper notification procedures
- This is my first offense with an otherwise clean record

Questions:
1. What are my rights during this process?
2. Should I request military counsel immediately?
3. Can character witnesses help my case?
4. What should I avoid saying or doing?

Any advice from those who've been through similar situations would be greatly appreciated. This is affecting my family and I'm worried about my career.`,
    category: "Legal Questions",
    tags: ["court-martial", "article-86", "article-92", "defense", "urgent"]
  };

  const replies = [
    {
      id: 1,
      author: "Attorney_Miller",
      branch: "Legal Expert",
      rank: "Verified Attorney",
      content: `I understand your concern. Here's what you need to know immediately:

**Immediate Actions:**
1. Exercise your Article 31 rights - you have the right to remain silent
2. Request military defense counsel NOW - don't wait
3. Document everything related to the family emergency
4. Gather character references from supervisors and peers

**Important Notes:**
- Don't discuss the case with anyone except your attorney
- Article 86 can be mitigated by emergency circumstances
- Your clean record is definitely in your favor

I recommend contacting the Defense Service Office at your installation immediately. Time is critical in these cases.`,
      createdAt: "1 hour ago",
      likes: 18,
      verified: true,
      helpful: true
    },
    {
      id: 2,
      author: "VeteranAdvocate",
      branch: "Army Veteran",
      rank: "Former JAG",
      content: `Been through this process as both defendant and legal advisor. Attorney Miller is absolutely right about getting counsel immediately.

Additional tips:
- Keep detailed records of all interactions
- Your family emergency documentation is crucial
- Character witnesses can significantly impact outcomes
- Consider requesting an Article 15 instead if offered

The key is proving the emergency circumstances were beyond your control and that you attempted to notify your chain of command. Don't give up hope - first offenses with good records often result in lesser punishments.`,
      createdAt: "45 minutes ago",
      likes: 12,
      verified: false,
      helpful: true
    },
    {
      id: 3,
      author: "SupportivePeer",
      branch: "Army",
      rank: "E-5",
      content: `Went through something similar last year. The stress is overwhelming, but you'll get through this.

What helped me:
- Got a really good military defense attorney
- Documented everything about the emergency
- Had my first sergeant write a character statement
- Family support was crucial during the process

Feel free to PM me if you want to talk privately about the process. Sometimes it helps to talk to someone who's been there.`,
      createdAt: "30 minutes ago",
      likes: 8,
      verified: false,
      helpful: false
    }
  ];

  const getBranchColor = (branch: string) => {
    switch (branch.toLowerCase()) {
      case "army": return "bg-green-100 text-green-800";
      case "navy": return "bg-blue-100 text-blue-800";
      case "air force": return "bg-sky-100 text-sky-800";
      case "marines": return "bg-red-100 text-red-800";
      case "coast guard": return "bg-orange-100 text-orange-800";
      case "legal expert": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleReply = () => {
    console.log("Submitting reply:", newReply);
    setNewReply("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Topic Header */}
      <section className="bg-navy-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/community-forum">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-navy-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forum
              </Button>
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/forum/category/legal-questions" className="text-gray-300 hover:text-white">
              {topic.category}
            </Link>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {topic.pinned && <Pin className="w-5 h-5 text-orange-400" />}
                {topic.urgent && <AlertCircle className="w-5 h-5 text-red-400" />}
                <h1 className="text-3xl font-bold">{topic.title}</h1>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{topic.author}</div>
                    <div className="text-sm text-gray-300">{topic.rank} • {topic.branch}</div>
                  </div>
                </div>
                <Badge className={getBranchColor(topic.branch)}>{topic.branch}</Badge>
                {topic.urgent && (
                  <Badge variant="destructive">Urgent</Badge>
                )}
              </div>

              <div className="flex items-center gap-6 text-gray-300">
                <span>{topic.views} views</span>
                <span>{topic.replies} replies</span>
                <span>{topic.likes} likes</span>
                <span>Created {topic.createdAt}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-navy-900">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-navy-900">
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Original Post */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-lg">{topic.author}</div>
                    <div className="text-sm text-gray-600">{topic.rank} • {topic.branch} • {topic.createdAt}</div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Original Post</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6">
                <div className="whitespace-pre-wrap text-gray-700">{topic.content}</div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {topic.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {topic.likes}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Quote className="w-4 h-4 mr-1" />
                    Quote
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Flag className="w-4 h-4 mr-1" />
                  Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Replies */}
          <div className="space-y-4 mb-8">
            {replies.map((reply, index) => (
              <Card key={reply.id} className="ml-8">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{reply.author}</span>
                          {reply.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                          {reply.helpful && <Badge className="bg-green-100 text-green-800 text-xs">Helpful</Badge>}
                        </div>
                        <div className="text-sm text-gray-600">{reply.rank} • {reply.branch} • {reply.createdAt}</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">#{index + 1}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none mb-4">
                    <div className="whitespace-pre-wrap text-gray-700">{reply.content}</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {reply.likes}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Quote className="w-4 h-4 mr-1" />
                        Quote
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      <Flag className="w-4 h-4 mr-1" />
                      Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Reply Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Post Reply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your advice, experience, or ask follow-up questions..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  rows={6}
                  className="w-full"
                />
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Remember: Don't share classified information or provide specific legal advice
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      Save Draft
                    </Button>
                    <Button onClick={handleReply} className="bg-blue-600 hover:bg-blue-700">
                      Post Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}