import { Header } from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronRight, 
  Crown, 
  Shield, 
  Calendar,
  Bell,
  HelpCircle,
  MessageSquare,
  FileText,
  Info,
  Zap
} from "lucide-react";

export const Settings = () => {
  const settingsItems = [
    {
      icon: Zap,
      title: "Alarm optimization",
      hasArrow: true,
      action: () => console.log("Alarm optimization")
    },
    {
      icon: Bell,
      title: "Alarm Setting",
      hasArrow: true,
      action: () => console.log("Alarm settings")
    },
    {
      icon: Calendar,
      title: "Dismiss Alarm/Mission",
      hasArrow: true,
      action: () => console.log("Dismiss settings")
    },
    {
      icon: FileText,
      title: "General",
      hasArrow: true,
      action: () => console.log("General settings")
    },
    {
      icon: Bell,
      title: "Notices",
      hasArrow: true,
      action: () => console.log("Notices")
    },
    {
      icon: HelpCircle,
      title: "FAQ",
      hasArrow: true,
      action: () => console.log("FAQ")
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
      action: () => console.log("About")
    },
  ];

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
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-medium text-foreground">Event</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
    </div>
  );
};