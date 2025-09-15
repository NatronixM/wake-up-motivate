import { useState } from "react";
import { Header } from "@/components/Header";
import { AlarmCard } from "@/components/AlarmCard";
import { AddAlarmDialog } from "@/components/AddAlarmDialog";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AlarmDismissalScreen } from "@/components/AlarmDismissalScreen";
import { Settings } from "./Settings";
import { EventCalendar } from "./EventCalendar";
import { SleepTracker } from "@/components/SleepTracker";
import { MorningFeeling } from "@/components/MorningFeeling";
import { Inspiration } from "@/components/Inspiration";
import { ProBanner } from "@/components/ProBanner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, Play } from "lucide-react";
import { toast } from "sonner";

interface Wallpaper {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  value: string;
  preview?: string;
}

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
  maxSnoozes?: number; // -1 for unlimited
  soundPowerUp?: number; // volume increase percentage
  volume?: number;
  wakeUpCheckEnabled?: boolean;
  wakeUpCheckType?: 'math' | 'memory' | 'shake' | 'photo' | 'barcode';
  wallpaper?: Wallpaper;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState('alarm');
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [snoozeCounts, setSnoozeCounts] = useState<Record<string, number>>({});
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

  const handleToggleAlarm = async (id: string, active: boolean) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, isActive: active } : alarm
      )
    );

    // Handle alarm scheduling
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      try {
        const { alarmManager } = await import('@/services/alarmManager');
        
        if (active) {
          await alarmManager.scheduleAlarm({
            id: alarm.id,
            time: alarm.time,
            label: alarm.label,
            isActive: true,
            repeatDays: alarm.repeatDays,
            soundName: alarm.soundName,
            volume: alarm.volume,
            missionEnabled: alarm.missionEnabled,
            missionCount: alarm.missionCount
          });
          toast.success("Alarm activated and scheduled!");
        } else {
          await alarmManager.cancelAlarm(alarm.id);
          toast.success("Alarm deactivated and cancelled");
        }
      } catch (error) {
        console.error('Failed to manage alarm:', error);
        toast.error("Failed to manage alarm scheduling");
      }
    }
  };

  const handleEditAlarm = (id: string, updates?: Partial<Alarm>) => {
    if (updates) {
      // Handle direct updates (like time changes)
      handleUpdateAlarmDirect(id, updates);
    } else {
      // Open edit dialog
      const alarm = alarms.find(a => a.id === id);
      if (alarm) {
        setEditingAlarm(alarm);
      }
    }
  };

  const handleUpdateAlarmDirect = async (id: string, updates: Partial<Alarm>) => {
    const updatedAlarms = alarms.map(alarm => 
      alarm.id === id ? { ...alarm, ...updates } : alarm
    );
    setAlarms(updatedAlarms);
    
    // Update alarm scheduling if alarm is active
    const updatedAlarm = updatedAlarms.find(a => a.id === id);
    if (updatedAlarm?.isActive) {
      try {
        const { alarmManager } = await import('@/services/alarmManager');
        await alarmManager.updateAlarm({
          id: updatedAlarm.id,
          time: updatedAlarm.time,
          label: updatedAlarm.label,
          isActive: updatedAlarm.isActive,
          repeatDays: updatedAlarm.repeatDays,
          soundName: updatedAlarm.soundName,
          volume: updatedAlarm.volume,
          missionEnabled: updatedAlarm.missionEnabled,
          missionCount: updatedAlarm.missionCount
        });
        toast.success("Alarm updated and rescheduled!");
      } catch (error) {
        console.error('Failed to reschedule alarm:', error);
        toast.error("Failed to reschedule alarm");
      }
    } else {
      toast.success("Alarm updated!");
    }
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
    toast.success("Alarm deleted");
  };

  const handleSkipOnce = (id: string) => {
    // In a real app, this would mark the alarm to be skipped for the next occurrence
    toast.success("Alarm will be skipped for the next occurrence");
  };

  const handleDuplicate = (id: string) => {
    const alarmToDuplicate = alarms.find(a => a.id === id);
    if (alarmToDuplicate) {
      const duplicatedAlarm: Alarm = {
        ...alarmToDuplicate,
        id: Date.now().toString(),
        label: `${alarmToDuplicate.label} (Copy)`,
        isActive: false
      };
      setAlarms(prev => [...prev, duplicatedAlarm]);
      toast.success("Alarm duplicated successfully!");
    }
  };

  const handleAddAlarm = (newAlarm: Omit<Alarm, 'id'>) => {
    const alarm: Alarm = {
      ...newAlarm,
      id: Date.now().toString()
    };
    setAlarms(prev => [...prev, alarm]);
    toast.success("Alarm created successfully!");
  };

  const handleUpdateAlarm = (updatedAlarm: Omit<Alarm, 'id'>) => {
    if (editingAlarm) {
      const updatedAlarms = alarms.map(alarm => 
        alarm.id === editingAlarm.id 
          ? { ...updatedAlarm, id: editingAlarm.id }
          : alarm
      );
      setAlarms(updatedAlarms);
      setEditingAlarm(null);
      toast.success("Alarm updated successfully!");
    }
  };

  const handleTestAlarm = (alarm: Alarm) => {
    setActiveAlarm(alarm);
    toast.success("Alarm triggered! Complete missions to dismiss.");
  };

  const handleDismissAlarm = () => {
    setActiveAlarm(null);
    toast.success("Alarm dismissed! Have a great day! 🌅");
  };

  const handleSnoozeAlarm = () => {
    if (activeAlarm) {
      const currentCount = snoozeCounts[activeAlarm.id] || 0;
      setSnoozeCounts(prev => ({
        ...prev,
        [activeAlarm.id]: currentCount + 1
      }));
      setActiveAlarm(null);
      toast.info(`Alarm snoozed for ${activeAlarm.snoozeDuration || 5} minutes`);
    }
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
          <SleepTracker onSetAlarm={() => setActiveTab('alarm')} />
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

  if (activeTab === 'inspiration') {
    return (
      <div>
        <Inspiration />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  if (activeTab === 'calendar') {
    return (
      <div>
        <EventCalendar />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header title="Wake Force Alarm Clock" showProBadge />
      
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

        {/* Student Deal Banner Ad */}
        <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-500 p-2 rounded-full">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">STUDENT DEAL</span>
                <span className="text-sm font-medium">Limited Time</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Get Pro for under $1/month with student ID verification
              </p>
            </div>
            <Button 
              size="sm" 
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Claim Deal
            </Button>
          </div>
        </Card>

        {/* Alarms List */}
        <div className="space-y-4">
          {alarms.map((alarm) => (
            <div key={alarm.id} className="space-y-2">
                <AlarmCard
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
                  onSkipOnce={handleSkipOnce}
                  onDuplicate={handleDuplicate}
                />
              {/* Test Alarm Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTestAlarm(alarm)}
                className="w-full text-xs"
              >
                <Play className="h-3 w-3 mr-1" />
                Test Alarm {alarm.missionEnabled ? `(${alarm.missionCount} missions)` : '(No missions)'}
              </Button>
            </div>
          ))}
        </div>

        {/* Add Alarm Button */}
        <div className="flex justify-center pt-6">
            <AddAlarmDialog 
              onAddAlarm={handleAddAlarm} 
              editingAlarm={editingAlarm}
              onUpdateAlarm={handleUpdateAlarm}
              onCancelEdit={() => setEditingAlarm(null)}
            />
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
      
      {/* Alarm Dismissal Screen */}
      {activeAlarm && (
        <AlarmDismissalScreen
          alarmId={activeAlarm.id}
          alarmLabel={activeAlarm.label}
          alarmTime={activeAlarm.time}
          missionEnabled={activeAlarm.missionEnabled || false}
          missionCount={activeAlarm.missionCount || 0}
          snoozeEnabled={activeAlarm.snoozeEnabled ?? true}
          snoozeDuration={activeAlarm.snoozeDuration || 5}
          maxSnoozes={activeAlarm.maxSnoozes ?? -1}
          currentSnoozeCount={snoozeCounts[activeAlarm.id] || 0}
          wakeUpCheckEnabled={activeAlarm.wakeUpCheckEnabled || false}
          wakeUpCheckType={activeAlarm.wakeUpCheckType || 'math'}
          soundPowerUp={activeAlarm.soundPowerUp || 0}
          onDismiss={handleDismissAlarm}
          onSnooze={handleSnoozeAlarm}
        />
      )}
    </div>
  );
};

export default Index;
