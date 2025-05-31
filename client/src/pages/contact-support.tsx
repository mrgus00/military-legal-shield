import Header from "@/components/header";
import Footer from "@/components/footer";
import SecurityReminder from "@/components/security-reminder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Shield, AlertTriangle } from "lucide-react";
import { useState } from "react";

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Support request submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Support
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the help you need from our military legal support team
            </p>
          </div>

          {/* Security Reminder */}
          <div className="mb-8">
            <SecurityReminder />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Submit a Support Request
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="attorney">Attorney Services</SelectItem>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                            <SelectItem value="legal">Legal Resources</SelectItem>
                            <SelectItem value="account">Account Management</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priority Level</Label>
                        <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        placeholder="Please provide detailed information about your issue or question"
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Submit Support Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* Emergency Contact */}
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-800 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Emergency Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700 mb-4">
                    For urgent legal matters requiring immediate attention:
                  </p>
                  <div className="space-y-2">
                    <p className="font-semibold text-red-800">24/7 Emergency Line</p>
                    <p className="text-red-700">1-800-MIL-HELP</p>
                    <Button variant="destructive" size="sm" className="w-full mt-3">
                      Call Emergency Line
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Regular Contact Methods */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-military-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">General Support</p>
                      <p className="text-gray-600">1-800-SUPPORT</p>
                      <p className="text-sm text-gray-500">Mon-Fri 8AM-6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-military-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-gray-600">support@millegaldefense.com</p>
                      <p className="text-sm text-gray-500">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-military-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Headquarters</p>
                      <p className="text-gray-600">
                        1234 Military Drive<br />
                        Washington, DC 20001
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-military-blue-600 mt-1" />
                    <div>
                      <p className="font-medium">Business Hours</p>
                      <p className="text-gray-600">
                        Monday - Friday: 8AM - 6PM EST<br />
                        Saturday: 9AM - 2PM EST<br />
                        Sunday: Emergency only
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Response Times */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-red-600 font-medium">Emergency</span>
                      <span className="text-gray-600">Within 1 hour</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-orange-600 font-medium">High Priority</span>
                      <span className="text-gray-600">Within 4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-600 font-medium">Medium Priority</span>
                      <span className="text-gray-600">Within 24 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-600 font-medium">Low Priority</span>
                      <span className="text-gray-600">Within 72 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}