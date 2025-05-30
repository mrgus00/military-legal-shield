import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, UserRoundCheck, GraduationCap, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function QuickActions() {
  const actions = [
    {
      icon: BookOpen,
      title: "Legal Library",
      description: "Browse comprehensive military law resources",
      href: "/resources",
      bgColor: "bg-navy-800",
      iconColor: "text-white"
    },
    {
      icon: UserRoundCheck,
      title: "Find Attorney",
      description: "Connect with specialized military lawyers",
      href: "/attorneys",
      bgColor: "bg-military-gold-500",
      iconColor: "text-navy-800"
    },
    {
      icon: GraduationCap,
      title: "Learn Rights",
      description: "Educational modules on military law",
      href: "/education",
      bgColor: "bg-emerald-500",
      iconColor: "text-white"
    },
    {
      icon: MessageCircle,
      title: "Get Support",
      description: "24/7 legal guidance and assistance",
      href: "#support",
      bgColor: "bg-blue-500",
      iconColor: "text-white"
    }
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {actions.map((action, index) => (
        <Link key={index} href={action.href}>
          <Card className="bg-gray-50 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 h-full">
            <CardContent className="p-6">
              <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <action.icon className={`${action.iconColor} w-6 h-6`} />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
              <p className="text-sm text-gray-600">{action.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
