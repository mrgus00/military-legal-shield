import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import Logo from "@/components/logo";

export default function Signup() {
  const handleReplitSignup = () => {
    // In development, simulate signup
    if (process.env.NODE_ENV === 'development') {
      window.location.href = '/api/signup';
    } else {
      // In production, trigger Replit OAuth
      window.location.href = '/api/signup';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Logo width={200} height={70} className="mx-auto mb-4" />
          </Link>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-navy-100">
              <Shield className="h-6 w-6 text-navy-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Join Military Legal Shield</CardTitle>
            <CardDescription className="text-gray-600">
              Get instant access to military legal resources and expert attorneys
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  24/7 emergency legal consultation
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Access to military-specialized attorneys
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Legal document generation tools
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  UCMJ support and guidance
                </div>
              </div>

              <Button 
                onClick={handleReplitSignup}
                className="w-full bg-navy-800 hover:bg-navy-900 text-white py-3"
                size="lg"
              >
                <Shield className="mr-2 h-5 w-5" />
                Create Account with Replit
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                Secure registration powered by Replit
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-navy-600 hover:text-navy-500">
                  Sign in here
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link href="/">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-gray-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms-of-service" className="text-navy-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-navy-600 hover:underline">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}