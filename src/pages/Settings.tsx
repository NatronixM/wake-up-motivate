import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Preferences } from "@capacitor/preferences";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { defaultTracks, MotivationalTrack } from "@/data/motivationalTracks";
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
  Plus,
  Trash2
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
  const [selectedTrack, setSelectedTrack] = useState<string>(defaultTracks[0].id);
  const [reminders, setReminders] = useState([
    { enabled: true, time: "15", unit: "minutes" },
    { enabled: false, time: "1", unit: "hours" },
    { enabled: false, time: "1", unit: "days" }
  ]);

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

  const saveEventAlarm = async () => {
    if (selectedDate && eventMessage && eventTime) {
      const eventData = { 
        date: selectedDate, 
        message: eventMessage, 
        time: eventTime,
        track: selectedTrack,
        reminders: reminders.filter(r => r.enabled)
      };
      
      // Save to Capacitor preferences (acts as local storage)
      try {
        const existingEvents = await Preferences.get({ key: 'eventAlarms' });
        const events = existingEvents.value ? JSON.parse(existingEvents.value) : [];
        events.push({ ...eventData, id: Date.now().toString() });
        
        await Preferences.set({ 
          key: 'eventAlarms', 
          value: JSON.stringify(events) 
        });
        
        // Sync with native calendar if possible
        syncToNativeCalendar(eventData);
        
        console.log("Event alarm saved:", eventData);
        
        // Reset form
        setEventOpen(false);
        setSelectedDate(undefined);
        setEventMessage("");
        setEventTime("09:00");
        setSelectedTrack(defaultTracks[0].id);
        setReminders([
          { enabled: true, time: "15", unit: "minutes" },
          { enabled: false, time: "1", unit: "hours" },
          { enabled: false, time: "1", unit: "days" }
        ]);
      } catch (error) {
        console.error('Failed to save event alarm:', error);
      }
    }
  };

  const syncToNativeCalendar = async (eventData: any) => {
    // This would use Capacitor Calendar plugin in a real implementation
    console.log('Syncing to native calendar:', eventData);
  };

  const updateReminder = (index: number, field: string, value: any) => {
    const newReminders = [...reminders];
    newReminders[index] = { ...newReminders[index], [field]: value };
    setReminders(newReminders);
  };

  const addCustomReminder = () => {
    setReminders([...reminders, { enabled: true, time: "30", unit: "minutes" }]);
  };

  const removeReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
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

            <div>
              <Label className="text-sm font-medium text-foreground">
                Motivational Track
              </Label>
              <Select value={selectedTrack} onValueChange={setSelectedTrack}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Choose a motivational track" />
                </SelectTrigger>
                <SelectContent>
                  {defaultTracks.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{track.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {track.category} • {track.duration}s
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium text-foreground">
                  Reminder Times
                </Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addCustomReminder}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      checked={reminder.enabled}
                      onCheckedChange={(checked) => 
                        updateReminder(index, 'enabled', checked)
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Time"
                      value={reminder.time}
                      onChange={(e) => updateReminder(index, 'time', e.target.value)}
                      className="w-16 h-8"
                      min="1"
                    />
                    <Select
                      value={reminder.unit}
                      onValueChange={(value) => updateReminder(index, 'unit', value)}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minutes">min</SelectItem>
                        <SelectItem value="hours">hrs</SelectItem>
                        <SelectItem value="days">days</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-muted-foreground">before</span>
                    {reminders.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReminder(index)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
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