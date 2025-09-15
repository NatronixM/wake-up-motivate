import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Preferences } from "@capacitor/preferences";
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
  Settings as SettingsIcon,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { PermissionsManager } from "@/utils/permissions";

export const Settings = () => {
  const [generalOpen, setGeneralOpen] = useState(false);
  const [troubleshootOpen, setTroubleshootOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
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

  const settingsItems = [
    {
      icon: FileText,
      title: "General",
      hasArrow: true,
      action: () => setGeneralOpen(true)
    },
    {
      icon: SettingsIcon,
      title: "Trouble Shoot",
      hasArrow: true,
      action: () => setTroubleshootOpen(true)
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

      {/* Troubleshoot Dialog */}
      <Dialog open={troubleshootOpen} onOpenChange={setTroubleshootOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Android Setup Guide
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Follow these steps to ensure Wake Force alarms work reliably on your Android device.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="bg-muted/20 p-3 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">1. Battery Optimization</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Disable battery optimization for Wake Force to prevent the system from stopping alarms.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // Open Android battery optimization settings
                    if (window.location.href.includes('android')) {
                      window.open('android-app://com.android.settings/.applications.ManageApplications', '_system');
                    }
                  }}
                >
                  Open Battery Settings
                </Button>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">2. Display Over Other Apps</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Allow Wake Force to display over other apps so alarms can take over your screen.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (window.location.href.includes('android')) {
                      window.open('android-app://com.android.settings/.applications.DrawOverlaySettings', '_system');
                    }
                  }}
                >
                  Open Display Settings
                </Button>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">3. Notification Access</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Ensure Wake Force has full notification permissions for reliable alarm alerts.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (window.location.href.includes('android')) {
                      window.open('android-app://com.android.settings/.applications.NotificationSettings', '_system');
                    }
                  }}
                >
                  Open Notification Settings
                </Button>
              </div>
              
              <div className="bg-muted/20 p-3 rounded-lg">
                <h4 className="font-medium text-foreground mb-2">4. Do Not Disturb Override</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Allow Wake Force alarms to bypass Do Not Disturb mode.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    if (window.location.href.includes('android')) {
                      window.open('android-app://com.android.settings/.ZenModeSettings', '_system');
                    }
                  }}
                >
                  Open DND Settings
                </Button>
              </div>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                💡 Tip: After changing these settings, restart Wake Force to ensure all permissions are properly applied.
              </p>
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
    </div>
  );
};