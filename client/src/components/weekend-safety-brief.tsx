import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  RefreshCw, 
  Clock, 
  AlertTriangle,
  Car,
  Home,
  Baby,
  Heart,
  Zap,
  Coffee,
  Settings,
  Save,
  Phone,
  User
} from "lucide-react";

interface SafetyBriefItem {
  icon: React.ElementType;
  title: string;
  message: string;
  category: 'critical' | 'important' | 'humor';
}

interface UserContacts {
  cdoNumber: string;
  eocNumber: string;
  battleBuddy: string;
  unitName: string;
  customReminder: string;
}

const SAFETY_BRIEF_ITEMS: SafetyBriefItem[] = [
  {
    icon: Car,
    title: "Don't Drink and Drive",
    message: "Call a battle buddy, use a rideshare, or walk. Your career isn't worth a DUI charge.",
    category: 'critical'
  },
  {
    icon: Heart,
    title: "Respect Your Family",
    message: "Don't abuse your spouse, children, or pets. Violence is never the answer - seek help if you need it.",
    category: 'critical'
  },
  {
    icon: Baby,
    title: "Child Safety First",
    message: "Don't leave your child in a hot car or alone anywhere. They depend on you completely.",
    category: 'critical'
  },
  {
    icon: Shield,
    title: "Use Protection",
    message: "Make smart choices. Wrap it up and avoid decisions you'll regret Monday morning.",
    category: 'important'
  },
  {
    icon: Home,
    title: "Know Your Limits",
    message: "If you're drinking, set a limit and stick to it. Have a plan to get home safely.",
    category: 'important'
  },
  {
    icon: AlertTriangle,
    title: "Avoid Stupid Decisions",
    message: "If it starts with 'Hey, watch this!' or 'Hold my beer!' - don't do it.",
    category: 'humor'
  },
  {
    icon: Coffee,
    title: "Pet the Fluffy Things",
    message: "Don't sweat the petty things, and don't pet the sweaty things. Know the difference.",
    category: 'humor'
  },
  {
    icon: Zap,
    title: "Social Media Wisdom",
    message: "Before posting anything, ask: Would my First Sergeant approve? If no, don't post it.",
    category: 'important'
  },
  {
    icon: Clock,
    title: "Sunday Scaries Prevention",
    message: "Set an alarm for Sunday evening to prep for Monday. Future you will thank present you.",
    category: 'important'
  },
  {
    icon: Shield,
    title: "Battle Buddy System",
    message: "Look out for each other. A good battle buddy prevents bad decisions and worse outcomes.",
    category: 'important'
  }
];

const WEEKEND_QUOTES = [
  "Remember: The only thing harder than explaining your weekend to your CO is explaining it to your spouse.",
  "Weekend liberty is a privilege, not a right. Don't let poor choices revoke it for everyone.",
  "Your weekend starts now. Make choices that let you look in the mirror Monday morning.",
  "Liberty call! Remember: Good judgment comes from experience, and experience comes from bad judgment. Skip the experience part.",
  "Have fun, stay safe, and remember - what happens on liberty doesn't always stay on liberty in the age of smartphones.",
  "Weekend checklist: Plan ahead, stay hydrated, make good choices, and text your battle buddy."
];

export default function WeekendSafetyBrief() {
  const [currentItems, setCurrentItems] = useState<SafetyBriefItem[]>([]);
  const [currentQuote, setCurrentQuote] = useState("");
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userContacts, setUserContacts] = useState<UserContacts>({
    cdoNumber: "",
    eocNumber: "",
    battleBuddy: "",
    unitName: "",
    customReminder: ""
  });

  // Load saved contacts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weekend-safety-contacts');
    if (saved) {
      setUserContacts(JSON.parse(saved));
    }
  }, []);

  const saveContacts = () => {
    localStorage.setItem('weekend-safety-contacts', JSON.stringify(userContacts));
    setShowSettings(false);
  };

  const generateBrief = () => {
    // Select 6 random items ensuring we get at least 2 critical ones
    const critical = SAFETY_BRIEF_ITEMS.filter(item => item.category === 'critical');
    const others = SAFETY_BRIEF_ITEMS.filter(item => item.category !== 'critical');
    
    const selectedCritical = critical.slice(0, 3); // All critical items
    const shuffledOthers = [...others].sort(() => Math.random() - 0.5);
    const selectedOthers = shuffledOthers.slice(0, 3);
    
    const allSelected = [...selectedCritical, ...selectedOthers].sort(() => Math.random() - 0.5);
    
    setCurrentItems(allSelected);
    setCurrentQuote(WEEKEND_QUOTES[Math.floor(Math.random() * WEEKEND_QUOTES.length)]);
    setLastGenerated(new Date());
  };

  useEffect(() => {
    generateBrief();
  }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'important':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'humor':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const timeUntilNextFriday = () => {
    const now = new Date();
    const nextFriday = new Date();
    const dayOfWeek = now.getDay();
    const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 7 - dayOfWeek + 5;
    
    nextFriday.setDate(now.getDate() + daysUntilFriday);
    nextFriday.setHours(17, 0, 0, 0); // 5 PM Friday
    
    const timeDiff = nextFriday.getTime() - now.getTime();
    const hoursUntil = Math.ceil(timeDiff / (1000 * 60 * 60));
    
    if (dayOfWeek === 5 && now.getHours() >= 17) return "Liberty call is NOW!";
    if (dayOfWeek === 6 || dayOfWeek === 0) return "Weekend in progress!";
    if (hoursUntil <= 24) return `${hoursUntil} hours until liberty call`;
    
    const daysUntil = Math.ceil(hoursUntil / 24);
    return `${daysUntil} days until liberty call`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <CardTitle className="text-2xl text-blue-900">Weekend Safety Brief</CardTitle>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="bg-white">
              {timeUntilNextFriday()}
            </Badge>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Customize
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateBrief}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                New Brief
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {showSettings && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="h-5 w-5 text-amber-600" />
                  Customize Your Safety Brief
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unitName" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Your Unit
                    </Label>
                    <Input
                      id="unitName"
                      placeholder="e.g., 1st Battalion, 8th Infantry"
                      value={userContacts.unitName}
                      onChange={(e) => setUserContacts(prev => ({ ...prev, unitName: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="battleBuddy" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Battle Buddy
                    </Label>
                    <Input
                      id="battleBuddy"
                      placeholder="Name and phone number"
                      value={userContacts.battleBuddy}
                      onChange={(e) => setUserContacts(prev => ({ ...prev, battleBuddy: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cdoNumber" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Command Duty Officer
                    </Label>
                    <Input
                      id="cdoNumber"
                      placeholder="CDO phone number"
                      value={userContacts.cdoNumber}
                      onChange={(e) => setUserContacts(prev => ({ ...prev, cdoNumber: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="eocNumber" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Emergency Operations Center
                    </Label>
                    <Input
                      id="eocNumber"
                      placeholder="EOC phone number"
                      value={userContacts.eocNumber}
                      onChange={(e) => setUserContacts(prev => ({ ...prev, eocNumber: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="customReminder" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Custom Unit Reminder
                  </Label>
                  <Textarea
                    id="customReminder"
                    placeholder="Add any specific reminders for your unit (e.g., formation times, special restrictions, etc.)"
                    value={userContacts.customReminder}
                    onChange={(e) => setUserContacts(prev => ({ ...prev, customReminder: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={saveContacts} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Settings
                  </Button>
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="bg-white p-4 rounded-lg border border-blue-200">
            <p className="text-center text-gray-700 italic">"{currentQuote}"</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <IconComponent className="h-5 w-5 text-blue-600 mt-1" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{item.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getCategoryColor(item.category)}`}
                          >
                            {item.category === 'critical' ? 'Critical' : 
                             item.category === 'important' ? 'Important' : 'Keep It Light'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{item.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-600 mr-2" />
              Emergency Contacts
            </h4>
            <div className="text-sm text-gray-600 space-y-1">
              {userContacts.cdoNumber && (
                <p><strong>Your Command Duty Officer:</strong> {userContacts.cdoNumber}</p>
              )}
              {userContacts.eocNumber && (
                <p><strong>Your Emergency Operations Center:</strong> {userContacts.eocNumber}</p>
              )}
              {userContacts.battleBuddy && (
                <p><strong>Your Battle Buddy:</strong> {userContacts.battleBuddy}</p>
              )}
              <p><strong>Military Police:</strong> 911 (on-base emergencies)</p>
              <p><strong>National Suicide Prevention Lifeline:</strong> 988</p>
              <p><strong>Military Crisis Line:</strong> 1-800-273-8255</p>
            </div>
          </div>

          {userContacts.customReminder && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 text-blue-600 mr-2" />
                {userContacts.unitName ? `${userContacts.unitName} Reminders` : 'Unit Reminders'}
              </h4>
              <p className="text-sm text-blue-800 whitespace-pre-wrap">{userContacts.customReminder}</p>
            </div>
          )}
          
          {lastGenerated && (
            <div className="text-xs text-gray-500 text-center">
              Brief generated at {lastGenerated.toLocaleTimeString()} on {lastGenerated.toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}