import { useState } from "react";
import { Header } from "@/components/Header";
import { AlarmCard } from "@/components/AlarmCard";
import { AddAlarmDialog } from "@/components/AddAlarmDialog";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Settings } from "./Settings";
import { SleepTracker } from "@/components/SleepTracker";
import { MorningFeeling } from "@/components/MorningFeeling";
import { ProBanner } from "@/components/ProBanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Alarm {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  repeatDays: string[];
  soundName: string;
  missionEnabled?: boolean;
  missionCount?: number;
  snoozeEnabled?: boolean;
  snoozeDuration?: number;
  volume?: number;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('alarm');
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: '1',
      time: '05:15',
      label: 'Morning workout',
      isActive: true,
      repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      soundName: 'Rise & Shine',
      missionEnabled: true,
      missionCount: 3,
      volume: 80
    },
    {
      id: '2',
      time: '23:06',
      label: 'Bedtime reminder',
      isActive: true,
      repeatDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      soundName: 'Peaceful Dreams',
      missionEnabled: false,
      volume: 70
    },
    {
      id: '3',
      time: '04:10',
      label: 'Early meditation',
      isActive: false,
      repeatDays: ['Mon', 'Wed', 'Fri'],
      soundName: 'Zen Chimes',
      missionEnabled: true,
      missionCount: 1,
      volume: 60
    }
  ]);

  const handleToggleAlarm = (id: string, active: boolean) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, isActive: active } : alarm
      )
    );
    toast.success(active ? "Alarm activated" : "Alarm deactivated");
  };

  const handleEditAlarm = (id: string) => {
    toast.info("Edit alarm feature coming soon!");
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    toast.success("Alarm deleted");
  };

  const handleAddAlarm = (newAlarm: Omit<Alarm, 'id'>) => {
    const alarm: Alarm = {
      ...newAlarm,
      id: Date.now().toString()
    };
    setAlarms(prev => [...prev, alarm]);
    toast.success("Alarm created successfully!");
  };

  if (activeTab === 'settings') {
    return (
      <div>
        <Settings />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  if (activeTab === 'sleep') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header title="Sleep Tracker" />
        <div className="px-4">
          <SleepTracker />
        </div>
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  if (activeTab === 'morning') {
    return (
      <div className="min-h-screen bg-background pb-20">
        <MorningFeeling />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Motivational Alarm Clock" showProBadge />
      
      <div className="px-4 space-y-6">
        {/* Next Alarm Info */}
        {alarms.some(a => a.isActive) && (
          <Card className="bg-gradient-hero p-6 shadow-glow border-0">
            <div className="text-center text-foreground">
              <p className="text-sm opacity-90 mb-1">Next alarm ⏰</p>
              <h2 className="text-3xl font-light">
                Ring in 13 hr. 57 min
              </h2>
            </div>
          </Card>
        )}

        {/* Pro Banner */}
        <ProBanner />

        {/* Student Deal Banner */}
        <Card className="bg-gradient-card border-border/50 p-4 shadow-card">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">September Student Deal</h3>
              <p className="text-sm text-muted-foreground">
                Students get Pro for under $1/month!
              </p>
            </div>
            <Button size="sm" variant="outline" className="border-border/50">
              Learn More
            </Button>
          </div>
        </Card>

        {/* Alarms List */}
        <div className="space-y-4">
          {alarms.map((alarm) => (
            <AlarmCard
              key={alarm.id}
              id={alarm.id}
              time={alarm.time}
              label={alarm.label}
              isActive={alarm.isActive}
              repeatDays={alarm.repeatDays}
              soundName={alarm.soundName}
              missionEnabled={alarm.missionEnabled}
              missionCount={alarm.missionCount}
              onToggle={handleToggleAlarm}
              onEdit={handleEditAlarm}
              onDelete={handleDeleteAlarm}
            />
          ))}
        </div>

        {/* Add Alarm Button */}
        <div className="flex justify-center pt-6">
          <AddAlarmDialog onAddAlarm={handleAddAlarm} />
        </div>

        {/* App Slogan */}
        <div className="text-center py-8">
          <h3 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Rise & Thrive! 🌅
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your motivation starts here
          </p>
        </div>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
