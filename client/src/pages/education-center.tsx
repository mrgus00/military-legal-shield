import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  GraduationCap, 
  Award, 
  Clock, 
  Users,
  Shield,
  Scale,
  Heart,
  FileText,
  Play,
  CheckCircle,
  Star,
  Bookmark
} from "lucide-react";
import { Link } from "wouter";

export default function EducationCenter() {
  const courseCategories = [
    {
      icon: Shield,
      title: "Military Law Basics",
      courses: 12,
      description: "Fundamental understanding of military legal system and UCMJ",
      color: "blue",
      level: "Beginner",
      duration: "2-4 hours"
    },
    {
      icon: Scale,
      title: "Legal Rights & Procedures",
      courses: 8,
      description: "Know your rights and legal procedures in military justice",
      color: "green",
      level: "Intermediate",
      duration: "3-5 hours"
    },
    {
      icon: Heart,
      title: "Family Law Essentials",
      courses: 10,
      description: "Military family law, deployment preparation, and protection",
      color: "pink",
      level: "Beginner",
      duration: "2-3 hours"
    },
    {
      icon: FileText,
      title: "Document Preparation",
      courses: 6,
      description: "Creating and understanding essential legal documents",
      color: "orange",
      level: "Practical",
      duration: "1-2 hours"
    }
  ];

  const featuredCourses = [
    {
      title: "Understanding Your UCMJ Rights",
      instructor: "Attorney Sarah Miller",
      duration: "45 minutes",
      students: 2847,
      rating: 4.9,
      level: "Beginner",
      description: "Comprehensive overview of your fundamental rights under the Uniform Code of Military Justice",
      modules: ["Article 31 Rights", "Court-Martial Process", "Defense Strategies", "Appeals Process"],
      free: true
    },
    {
      title: "Deployment Legal Checklist",
      instructor: "Major (Ret.) David Chen",
      duration: "30 minutes",
      students: 1923,
      rating: 4.8,
      level: "Practical",
      description: "Essential legal preparations before deployment including POAs and family care plans",
      modules: ["Power of Attorney", "Family Care Plans", "Wills & Estates", "Emergency Contacts"],
      free: true
    },
    {
      title: "VA Benefits Maximization",
      instructor: "VA Expert Lisa Rodriguez",
      duration: "1 hour",
      students: 3156,
      rating: 4.9,
      level: "Intermediate",
      description: "Complete guide to understanding and maximizing your veteran benefits and claims",
      modules: ["Disability Claims", "Education Benefits", "Healthcare Access", "Appeals Process"],
      free: false
    },
    {
      title: "Court-Martial Defense Fundamentals",
      instructor: "Attorney Michael Thompson",
      duration: "1.5 hours",
      students: 891,
      rating: 4.7,
      level: "Advanced",
      description: "In-depth look at court-martial proceedings and defense strategies",
      modules: ["Types of Courts-Martial", "Evidence Rules", "Defense Planning", "Sentencing"],
      free: false
    }
  ];

  const legalGuides = [
    {
      title: "Military Justice Quick Reference",
      type: "PDF Guide",
      pages: 24,
      downloads: 12450,
      description: "Comprehensive quick reference for common UCMJ articles and procedures",
      free: true
    },
    {
      title: "Deployment Legal Checklist",
      type: "Interactive Checklist",
      pages: 8,
      downloads: 8923,
      description: "Step-by-step checklist for all legal preparations before deployment",
      free: true
    },
    {
      title: "Family Law Handbook",
      type: "Digital Handbook",
      pages: 56,
      downloads: 6734,
      description: "Complete guide to military family law including divorce, custody, and POAs",
      free: false
    },
    {
      title: "VA Claims Strategy Guide",
      type: "Strategy Guide",
      pages: 42,
      downloads: 9187,
      description: "Proven strategies for successful VA disability claims and appeals",
      free: false
    }
  ];

  const webinars = [
    {
      title: "Navigating Military Divorce",
      date: "January 25, 2025",
      time: "7:00 PM EST",
      speaker: "Attorney Jennifer Walsh",
      attendees: 234,
      status: "upcoming"
    },
    {
      title: "Court-Martial Defense Workshop",
      date: "January 18, 2025",
      time: "6:00 PM EST",
      speaker: "Major (Ret.) Robert Kim",
      attendees: 189,
      status: "recorded"
    },
    {
      title: "VA Benefits Deep Dive",
      date: "January 11, 2025",
      time: "7:30 PM EST",
      speaker: "VA Expert Maria Santos",
      attendees: 456,
      status: "recorded"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6">Education Center</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Comprehensive legal education designed specifically for military personnel. 
              Learn your rights, understand procedures, and protect yourself and your family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Play className="w-5 h-5 mr-2" />
                Start Learning
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse All Courses
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Statistics */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">8,450</div>
              <div className="text-gray-600">Active Learners</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">36</div>
              <div className="text-gray-600">Courses Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">15,230</div>
              <div className="text-gray-600">Certificates Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">4.8</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Learning Paths</h2>
            <p className="text-xl text-gray-600">Structured courses designed for your military legal education needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className={`border-l-4 border-l-${category.color}-500 hover:shadow-lg transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="text-center">
                      <div className={`w-16 h-16 bg-${category.color}-100 rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <IconComponent className={`w-8 h-8 text-${category.color}-600`} />
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <Badge variant="outline" className="mt-1">{category.courses} courses</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 text-center">{category.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Level:</span>
                        <Badge className={`bg-${category.color}-100 text-${category.color}-800 text-xs`}>
                          {category.level}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Duration:</span>
                        <span className="font-medium">{category.duration}</span>
                      </div>
                    </div>

                    <Button className={`w-full bg-${category.color}-600 hover:bg-${category.color}-700`}>
                      Start Learning Path
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600">Most popular and highly-rated courses from legal experts</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {featuredCourses.map((course, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{course.instructor}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{course.duration}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">{course.students} students</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={course.free ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}>
                        {course.free ? "Free" : "Premium"}
                      </Badge>
                      <Badge variant="outline">{course.level}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Course Modules:</h4>
                    <div className="grid grid-cols-2 gap-1">
                      {course.modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} className="flex items-center gap-1 text-xs text-gray-600">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {module}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                      <Play className="w-4 h-4 mr-2" />
                      {course.free ? "Start Course" : "Enroll Now"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Guides & Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Legal Guides & Resources</h2>
            <p className="text-xl text-gray-600">Downloadable guides and reference materials</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {legalGuides.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{guide.title}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{guide.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 text-center">{guide.description}</p>
                  
                  <div className="space-y-2 mb-4 text-center">
                    <div className="text-sm text-gray-600">{guide.pages} pages</div>
                    <div className="text-sm text-gray-600">{guide.downloads} downloads</div>
                  </div>

                  <Button className={`w-full ${guide.free ? 'bg-green-600 hover:bg-green-700' : 'bg-orange-600 hover:bg-orange-700'}`}>
                    {guide.free ? 'Download Free' : 'Premium Access'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Live Webinars & Events</h2>
            <p className="text-xl text-gray-600">Join live sessions with military legal experts</p>
          </div>

          <div className="space-y-4">
            {webinars.map((webinar, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-navy-900 mb-1">{webinar.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{webinar.date} at {webinar.time}</span>
                          <span>Speaker: {webinar.speaker}</span>
                          <span>{webinar.attendees} registered</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={webinar.status === "upcoming" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                        {webinar.status === "upcoming" ? "Upcoming" : "Recorded"}
                      </Badge>
                      <Button size="sm">
                        {webinar.status === "upcoming" ? "Register" : "Watch Recording"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Program */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <Award className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Military Legal Education Certificate</h2>
          <p className="text-xl mb-8">
            Complete our comprehensive program and earn a certificate in Military Legal Fundamentals. 
            Demonstrate your knowledge and commitment to understanding military law.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">12 Courses</div>
              <div className="text-purple-200">Complete curriculum</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">20 Hours</div>
              <div className="text-purple-200">Self-paced learning</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Certificate</div>
              <div className="text-purple-200">Official completion</div>
            </div>
          </div>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            <Award className="w-5 h-5 mr-2" />
            Start Certificate Program
          </Button>
        </div>
      </section>

      {/* Get Started */}
      <section className="py-16 bg-navy-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <BookOpen className="w-16 h-16" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Start Your Legal Education Journey</h2>
          <p className="text-xl mb-8">
            Knowledge is your best defense. Gain the legal education you need to protect yourself, 
            your career, and your family throughout your military service and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Play className="w-5 h-5 mr-2" />
              Start Free Course
            </Button>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-navy-900">
                View Premium Access
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}