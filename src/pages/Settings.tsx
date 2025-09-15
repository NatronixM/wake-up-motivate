import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TroubleshootTab } from "@/components/TroubleshootTab";
import { Preferences } from "@capacitor/preferences";
import { 
  ChevronRight, 
  Crown, 
  Shield, 
  FileText,
  Wrench,
  HelpCircle,
  MessageSquare,
  Info,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import { useState, useEffect } from "react";
import { PermissionsManager } from "@/utils/permissions";

export const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [tutorialStep, setTutorialStep] = useState(0);
  const [preventPowerOff, setPreventPowerOff] = useState(false);
  const [wakeLock, setWakeLock] = useState<any>(null);

  // Request all necessary permissions on component mount
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        await PermissionsManager.requestAllAlarmPermissions();
      } catch (error) {
        console.error('Failed to request permissions:', error);
      }
    };
    
    requestPermissions();
  }, []);

  // Load prevent power-off setting on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { value } = await Preferences.get({ key: 'preventPowerOff' });
        const isEnabled = value === 'true';
        setPreventPowerOff(isEnabled);
        
        if (isEnabled) {
          await enableWakeLock();
        }
      } catch (error) {
        console.error('Failed to load prevent power-off setting:', error);
      }
    };
    
    loadSettings();
  }, []);

  const enableWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        const lock = await (navigator as any).wakeLock.request('screen');
        setWakeLock(lock);
        
        // Listen for wake lock release
        lock.addEventListener('release', () => {
          console.log('Wake lock released');
          setWakeLock(null);
        });
        
        console.log('Wake lock enabled');
        return true;
      } else {
        console.warn('Wake Lock API not supported');
        return false;
      }
    } catch (error) {
      console.error('Failed to enable wake lock:', error);
      return false;
    }
  };

  const disableWakeLock = async () => {
    try {
      if (wakeLock) {
        await wakeLock.release();
        setWakeLock(null);
        console.log('Wake lock disabled');
      }
    } catch (error) {
      console.error('Failed to disable wake lock:', error);
    }
  };

  const togglePreventPowerOff = async (enabled: boolean) => {
    try {
      setPreventPowerOff(enabled);
      
      // Save setting to preferences
      await Preferences.set({ 
        key: 'preventPowerOff', 
        value: enabled.toString() 
      });
      
      if (enabled) {
        const success = await enableWakeLock();
        if (!success) {
          // If wake lock failed, revert the setting
          setPreventPowerOff(false);
          await Preferences.set({ 
            key: 'preventPowerOff', 
            value: 'false' 
          });
        }
      } else {
        await disableWakeLock();
      }
    } catch (error) {
      console.error('Failed to toggle prevent power-off:', error);
      // Revert on error
      setPreventPowerOff(!enabled);
    }
  };

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

  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setActiveTab("general");
      setTutorialStep(0);
    }
  };

  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(tutorialStep - 1);
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
                <div className={`p-2 rounded-lg transition-colors ${
                  preventPowerOff ? 'bg-green-500/20' : 'bg-muted/20'
                }`}>
                  <Shield className={`h-5 w-5 transition-colors ${
                    preventPowerOff ? 'text-green-500' : 'text-muted-foreground'
                  }`} />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-foreground">Prevent power-off</span>
                  <span className="text-xs text-muted-foreground">
                    Keep screen awake during alarms
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium transition-colors ${
                  preventPowerOff ? 'text-green-500' : 'text-muted-foreground'
                }`}>
                  {preventPowerOff ? 'ON' : 'OFF'}
                </span>
                <Switch 
                  checked={preventPowerOff} 
                  onCheckedChange={togglePreventPowerOff}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Settings Tabs */}
        <Card className="bg-gradient-card border-border/50 shadow-card">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/20">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="troubleshoot" className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                <span className="hidden sm:inline">Troubleshoot</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">About</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="general" className="mt-0 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Version Motivated</h3>
                  <p className="text-muted-foreground mb-4">
                    You're using the latest version of our motivation and productivity app, designed to help you achieve peak performance every day.
                  </p>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => window.location.href = "mailto:asuite20@gmail.com?subject=Feedback"}
                    >
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5" />
                        <span>Send Feedback</span>
                      </div>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => window.location.href = "mailto:asuite20@gmail.com?subject=Report"}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5" />
                        <span>Report Issue</span>
                      </div>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="troubleshoot" className="mt-0">
                <TroubleshootTab />
              </TabsContent>

              <TabsContent value="faq" className="mt-0 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {tutorialSteps[tutorialStep].title}
                  </h3>
                  <p className="text-muted-foreground text-base leading-relaxed mb-6">
                    {tutorialSteps[tutorialStep].content}
                  </p>
                  
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
              </TabsContent>

              <TabsContent value="about" className="mt-0 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Built to be the Best</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    This app was crafted with one mission in mind: to help you become the best version of yourself. 
                    Every feature, from smart alarms to daily inspiration, is designed to push you toward excellence 
                    and peak performance in all areas of your life.
                  </p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};