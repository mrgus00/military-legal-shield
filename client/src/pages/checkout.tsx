import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  Lock,
  Zap,
  Star
} from "lucide-react";

// Load Stripe - only if the public key is available
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY ? 
  loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY) : 
  null;

interface CheckoutFormProps {
  amount: number;
  service: string;
}

const CheckoutForm = ({ amount, service }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?service=${encodeURIComponent(service)}`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full bg-navy-600 hover:bg-navy-700" 
        disabled={!stripe || isProcessing}
      >
        <Lock className="h-4 w-4 mr-2" />
        {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(149);
  const [selectedService, setSelectedService] = useState("Emergency Services");
  const { toast } = useToast();

  const services = [
    {
      id: "emergency",
      name: "Emergency Services",
      price: 149,
      description: "Immediate connection to verified military law attorney",
      features: [
        "Immediate attorney connection",
        "Crisis legal support", 
        "24/7 availability",
        "Priority case handling"
      ]
    },
    {
      id: "emergency-premium",
      name: "Emergency Services Premium",
      price: 199,
      description: "Enhanced emergency legal support with dedicated attorney",
      features: [
        "Dedicated attorney assignment",
        "Immediate response guarantee",
        "Extended consultation time",
        "Follow-up documentation"
      ]
    },
    {
      id: "premium-defense",
      name: "Premium Defense Monthly",
      price: 49.99,
      description: "Monthly subscription for unlimited attorney contacts",
      features: [
        "Unlimited attorney contacts",
        "24-hour response guarantee",
        "Monthly legal check-ins",
        "Priority support queue"
      ]
    },
    {
      id: "professional-defense",
      name: "Professional Defense Monthly",
      price: 99.99,
      description: "Premium monthly service with dedicated case manager",
      features: [
        "Dedicated case manager",
        "2-hour response guarantee",
        "Unlimited consultations",
        "Advanced legal strategies"
      ]
    }
  ];

  useEffect(() => {
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      toast({
        title: "Payment System Unavailable",
        description: "Stripe keys are not configured. Please contact support.",
        variant: "destructive",
      });
      return;
    }

    // Create PaymentIntent when component loads
    const createPaymentIntent = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: amount,
          service: selectedService 
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Payment intent creation error:", error);
        toast({
          title: "Setup Error",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      }
    };

    createPaymentIntent();
  }, [amount, selectedService, toast]);

  const selectService = (service: any) => {
    setSelectedService(service.name);
    setAmount(service.price);
    setClientSecret(""); // Reset to trigger new payment intent
  };

  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-sage-50">
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <CardContent className="p-8 text-center">
                <CreditCard className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-700 mb-2">Payment System Configuration Required</h2>
                <p className="text-red-600">
                  Stripe payment keys need to be configured to process payments. Please contact support to set up payment processing.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-sage-50">
        <Header />
        <main className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-navy-200 border-t-navy-600 rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-navy-700">Setting up secure payment...</h2>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-sage-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-military-gold-100 to-navy-100 rounded-full">
                <CreditCard className="h-12 w-12 text-navy-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-navy-700 mb-4">
              Secure Payment Portal
            </h1>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto mb-8">
              Professional legal services for military personnel and veterans. 
              All payments are processed securely through industry-standard encryption.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge className="bg-sage-100 text-sage-800 px-4 py-2">
                <Shield className="h-4 w-4 mr-1" />
                256-bit SSL Encryption
              </Badge>
              <Badge className="bg-navy-100 text-navy-800 px-4 py-2">
                <Lock className="h-4 w-4 mr-1" />
                PCI Compliant
              </Badge>
              <Badge className="bg-military-gold-100 text-military-gold-800 px-4 py-2">
                <Zap className="h-4 w-4 mr-1" />
                Instant Processing
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Service Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy-700">Select Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedService === service.name
                          ? "border-navy-500 bg-navy-50"
                          : "border-gray-200 hover:border-navy-300"
                      }`}
                      onClick={() => selectService(service)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-navy-700">{service.name}</h3>
                        <div className="text-right">
                          <span className="text-2xl font-bold text-navy-600">${service.price}</span>
                          {selectedService === service.name && (
                            <CheckCircle className="h-5 w-5 text-sage-500 ml-2 inline" />
                          )}
                        </div>
                      </div>
                      <p className="text-navy-600 text-sm mb-3">{service.description}</p>
                      <ul className="space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <Star className="h-3 w-3 text-military-gold-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Payment Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-navy-700">Payment Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6 p-4 bg-sage-50 rounded-lg border border-sage-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-navy-700">Service:</span>
                      <span className="text-navy-600">{selectedService}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-navy-700">Total:</span>
                      <span className="text-2xl font-bold text-navy-600">${amount.toFixed(2)}</span>
                    </div>
                  </div>

                  {stripePromise && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                      <CheckoutForm amount={amount} service={selectedService} />
                    </Elements>
                  )}
                </CardContent>
              </Card>

              {/* Security Info */}
              <Card className="bg-gradient-to-r from-sage-50 to-navy-50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-navy-700 mb-3 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Your Payment is Secure
                  </h3>
                  <ul className="space-y-2 text-sm text-navy-600">
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                      Bank-level encryption protects your information
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                      We never store your payment details
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-sage-500 mr-2" />
                      Processed by Stripe, trusted by millions
                    </li>
                  </ul>
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