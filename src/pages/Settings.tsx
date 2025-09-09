import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  ChevronRight, 
  Crown, 
  Shield, 
  Calendar as CalendarIcon,
  HelpCircle,
  MessageSquare,
  FileText,
  Info,
  X,
  ArrowRight,
  ArrowLeft,
  Plus
} from "lucide-react";
import { useState, useEffect } from "react";
import { PermissionsManager } from "@/utils/permissions";

export const Settings = () => {
  const [generalOpen, setGeneralOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [eventMessage, setEventMessage] = useState("");
  const [eventTime, setEventTime] = useState("09:00");

  // Request all necessary permissions on component mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await PermissionsManager.requestAllAlarmPermissions();
        // Request screen wake lock to prevent power-off
        if ('wakeLock' in navigator) {
          await (navigator as any).wakeLock.request('screen');
        }
      } catch (error) {
        console.error('Failed to request permissions:', error);
      }
    };
    
    requestPermissions();
  }, []);

  const tutorialSteps = [
    {
      title: "Welcome to Your Motivation Hub!",
      content: "This app is designed to help you wake up refreshed, stay motivated, and achieve peak performance. Let's walk through the main features.",
      highlight: "bottom-navigation"
    },
    {
      title: "Sleep Tracking",
      content: "Track your sleep quality, get personalized recommendations, and analyze your sleep patterns for better rest.",
      highlight: "sleep-tab"
    },
    {
      title: "Smart Alarms",
      content: "Set alarms with custom missions to ensure you wake up fully alert. Choose from math problems, photo missions, and more.",
      highlight: "alarm-tab"
    },
    {
      title: "Daily Inspiration",
      content: "Access motivational quotes, fitness recommendations, financial insights, and social connection tips to fuel your success.",
      highlight: "inspiration-tab"
    },
    {
      title: "Personal Settings",
      content: "Customize your experience, manage notifications, and access support features in the settings tab.",
      highlight: "settings-tab"
    },
    {
      title: "You're All Set!",
      content: "Start your journey to peak performance. Remember, consistency is key to achieving your goals!",
      highlight: "none"
    }
  ];

  const settingsItems = [
    {
      icon: FileText,
      title: "General",
      hasArrow: true,
      action: () => setGeneralOpen(true)
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      hasArrow: true,
      action: () => setFaqOpen(true)
    },
    {
      icon: MessageSquare,
      title: "Send feedback",
      hasArrow: true,
      action: () => window.location.href = "mailto:asuite20@gmail.com?subject=Feedback"
    },
    {
      icon: FileText,
      title: "Report",
      hasArrow: true,
      action: () => window.location.href = "mailto:asuite20@gmail.com?subject=Report"
    },
    {
      icon: Info,
      title: "About",
      hasArrow: true,
      action: () => setAboutOpen(true)
    },
  ];

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setFaqOpen(false);
      setTutorialStep(0);
    }
  };

  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
    }
  };

  const closeTutorial = () => {
    setFaqOpen(false);
    setTutorialStep(0);
  };

  const saveEventAlarm = () => {
    if (selectedDate && eventMessage && eventTime) {
      // Here you would typically save to localStorage or backend
      console.log("Event alarm saved:", { 
        date: selectedDate, 
        message: eventMessage, 
        time: eventTime 
      });
      setEventOpen(false);
      setSelectedDate(undefined);
      setEventMessage("");
      setEventTime("09:00");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Settings" />
      
      <div className="px-4 space-y-6">
        {/* User Profile Card */}
        <Card className="bg-gradient-card border-border/50 p-4 shadow-card">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback className="bg-primary text-primary-foreground">
                BM
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Bryan Miller</h3>
              <p className="text-sm text-muted-foreground">
                1 day since I started my journey to peak performance 💪
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Premium Features Card */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <div className="p-4 space-y-4">
            {/* Pro Upgrade */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-destructive/20 p-2 rounded-lg">
                  <Crown className="h-5 w-5 text-destructive" />
                </div>
                <span className="font-medium text-foreground">Pro</span>
              </div>
              <Button 
                variant="secondary"
                size="sm"
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                Upgrade
              </Button>
            </div>

            {/* Prevent Power-off */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/20 p-2 rounded-lg">
                  <Shield className="h-5 w-5 text-green-500" />
                </div>
                <span className="font-medium text-foreground">Prevent power-off</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-green-500 font-medium">ON</span>
                <Switch checked={true} />
              </div>
            </div>

            {/* Event */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-secondary p-2 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-medium text-foreground">Event</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEventOpen(true)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Settings List */}
        <div className="space-y-2">
          {settingsItems.map((item, index) => (
            <Card
              key={index}
              className="bg-card/50 border-border/30 hover:bg-card/70 transition-colors"
            >
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto"
                onClick={item.action}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium text-foreground">{item.title}</span>
                </div>
                {item.hasArrow && (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* General Dialog */}
      <Dialog open={generalOpen} onOpenChange={setGeneralOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Version Motivated</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              You're using the latest version of our motivation and productivity app, designed to help you achieve peak performance every day.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* FAQ Tutorial Dialog */}
      <Dialog open={faqOpen} onOpenChange={setFaqOpen}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-foreground">
                {tutorialSteps[tutorialStep].title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeTutorial}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <DialogDescription className="text-muted-foreground text-base leading-relaxed">
              {tutorialSteps[tutorialStep].content}
            </DialogDescription>
            
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === tutorialStep
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                {tutorialStep > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevTutorialStep}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={nextTutorialStep}
                  className="flex items-center gap-2"
                >
                  {tutorialStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
                  {tutorialStep < tutorialSteps.length - 1 && (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Built to be the Best</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This app was crafted with one mission in mind: to help you become the best version of yourself. 
              Every feature, from smart alarms to daily inspiration, is designed to push you toward excellence 
              and peak performance in all areas of your life.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Event Calendar Dialog */}
      <Dialog open={eventOpen} onOpenChange={setEventOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Event Alarm</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Select a date and set a custom alarm for your event.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="event-date" className="text-sm font-medium text-foreground">
                Select Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-2",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="event-time" className="text-sm font-medium text-foreground">
                Time
              </Label>
              <Input
                id="event-time"
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="event-message" className="text-sm font-medium text-foreground">
                Event Message
              </Label>
              <Input
                id="event-message"
                placeholder="Enter your event message..."
                value={eventMessage}
                onChange={(e) => setEventMessage(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setEventOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={saveEventAlarm}
                disabled={!selectedDate || !eventMessage}
                className="flex-1"
              >
                Save Alarm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};