import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AlarmCard } from "@/components/AlarmCard";
import { AddAlarmDialog } from "@/components/AddAlarmDialog";
import { BottomNavigation } from "@/components/BottomNavigation";
import { AlarmDismissalScreen } from "@/components/AlarmDismissalScreen";
import { AlarmTriggeredScreen } from "@/components/AlarmTriggeredScreen";
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
import { AlarmScheduler, Alarm } from "@/utils/alarmScheduler";

interface Wallpaper {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  value: string;
  preview?: string;
}

const Index = () => {
  console.log("Index component rendering");
  const [activeTab, setActiveTab] = useState('alarm');
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [activeAlarm, setActiveAlarm] = useState<Alarm | null>(null);
  const [triggeredAlarm, setTriggeredAlarm] = useState<Alarm | null>(null);
  const [snoozeCounts, setSnoozeCounts] = useState<Record<string, number>>({});
  const [lastTriggeredMinute, setLastTriggeredMinute] = useState<Record<string, string>>({});

  const getMinuteKey = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  };
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: '1',
      time: '05:15',
      label: 'Morning workout',
      isActive: true,
      repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      soundName: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/rise_and_shine.mp3',
      missionEnabled: true,
      selectedMissions: ['math', 'memory', 'shake'],
      volume: 80,
      snoozeEnabled: true,
      snoozeDuration: 5,
      maxSnoozes: 3,
      wakeUpCheckEnabled: true,
      wakeUpCheckType: 'math'
    },
    {
      id: '2',
      time: '23:06',
      label: 'Bedtime reminder',
      isActive: true,
      repeatDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      soundName: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Peaceful%20Going%20to%20Have%20a%20Good%20Day.mp3',
      missionEnabled: false,
      volume: 70,
      snoozeEnabled: false
    },
    {
      id: '3',
      time: '04:10',
      label: 'Early meditation',
      isActive: false,
      repeatDays: ['Mon', 'Wed', 'Fri'],
      soundName: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Peaceful%20Hi.mp3',
      missionEnabled: true,
      selectedMissions: ['barcode'],
      volume: 60,
      snoozeEnabled: true,
      snoozeDuration: 10,
      maxSnoozes: 2
    }
  ]);

  // Initialize alarm scheduler and check for triggered alarms
  useEffect(() => {
    AlarmScheduler.initialize();

    // Load stored alarms if any
    const storedAlarms = AlarmScheduler.getStoredAlarms();
    if (storedAlarms.length > 0) {
      setAlarms(storedAlarms);
    }

    const checkAlarms = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const minuteKey = getMinuteKey(now);
      
      const activeList = alarms.filter(a => a.isActive);
      const alarmToTrigger = activeList.find(a => 
        a.time === currentTime && !triggeredAlarm && lastTriggeredMinute[a.id] !== minuteKey
      );
      
      if (alarmToTrigger) {
        setLastTriggeredMinute(prev => ({ ...prev, [alarmToTrigger.id]: minuteKey }));
        setTriggeredAlarm(alarmToTrigger);
      }
    };

    // Check immediately and then every 30 seconds
    checkAlarms();
    const interval = setInterval(checkAlarms, 30000);

    // Listen for alarm messages from service worker
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'ALARM_TRIGGERED' && event.data.alarm) {
        const alarm = event.data.alarm as Alarm;
        const minuteKey = getMinuteKey(new Date());
        setLastTriggeredMinute(prev => ({ ...prev, [alarm.id]: minuteKey }));
        setTriggeredAlarm(alarm);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('message', handleMessage);
    };
  }, [alarms, triggeredAlarm, lastTriggeredMinute]);

  const handleToggleAlarm = async (id: string, active: boolean) => {
    const updatedAlarms = alarms.map(alarm => 
      alarm.id === id ? { ...alarm, isActive: active } : alarm
    );
    setAlarms(updatedAlarms);
    
    // Schedule or cancel alarm based on active state
    const alarm = updatedAlarms.find(a => a.id === id);
    if (alarm) {
      if (active) {
        await AlarmScheduler.scheduleAlarm(alarm);
        toast.success("Alarm scheduled and will work even when screen is locked!");
      } else {
        await AlarmScheduler.cancelAlarm(id);
        toast.success("Alarm deactivated");
      }
    }
  };

  const handleEditAlarm = (id: string) => {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      setEditingAlarm(alarm);
    }
  };

  const handleDeleteAlarm = async (id: string) => {
    // Cancel alarm before deleting
    await AlarmScheduler.cancelAlarm(id);
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

  const handleAddAlarm = async (newAlarm: Omit<Alarm, 'id'>) => {
    const alarm: Alarm = {
      ...newAlarm,
      id: Date.now().toString()
    };
    setAlarms(prev => [...prev, alarm]);
    
    // Schedule the alarm for background functionality
    if (alarm.isActive) {
      await AlarmScheduler.scheduleAlarm(alarm);
      toast.success("Alarm created and scheduled! It will work even when screen is locked.");
    } else {
      toast.success("Alarm created successfully!");
    }
  };

  const handleUpdateAlarm = async (updatedAlarm: Omit<Alarm, 'id'>) => {
    if (editingAlarm) {
      const alarm: Alarm = { ...updatedAlarm, id: editingAlarm.id };
      const updatedAlarms = alarms.map(existingAlarm => 
        existingAlarm.id === editingAlarm.id ? alarm : existingAlarm
      );
      setAlarms(updatedAlarms);
      setEditingAlarm(null);
      
      // Reschedule the alarm
      if (alarm.isActive) {
        await AlarmScheduler.scheduleAlarm(alarm);
        toast.success("Alarm updated and rescheduled!");
      } else {
        await AlarmScheduler.cancelAlarm(alarm.id);
        toast.success("Alarm updated!");
      }
    }
  };

  const handleTestAlarm = (alarm: Alarm) => {
    setActiveAlarm(alarm);
    toast.success("Alarm triggered! Complete missions to dismiss.");
  };

  const handleDismissAlarm = () => {
    const id = triggeredAlarm?.id || activeAlarm?.id;
    if (id) {
      const mk = getMinuteKey(new Date());
      setLastTriggeredMinute(prev => ({ ...prev, [id]: mk }));
    }
    setActiveAlarm(null);
    setTriggeredAlarm(null);
    AlarmScheduler.stopAlarmSound();
    toast.success("Alarm dismissed! Have a great day! 🌅");
  };

  const handleSnoozeAlarm = () => {
    const currentAlarm = activeAlarm || triggeredAlarm;
    if (currentAlarm) {
      // Prevent re-trigger within the same minute
      const mk = getMinuteKey(new Date());
      setLastTriggeredMinute(prev => ({ ...prev, [currentAlarm.id]: mk }));

      const currentCount = snoozeCounts[currentAlarm.id] || 0;
      setSnoozeCounts(prev => ({
        ...prev,
        [currentAlarm.id]: currentCount + 1
      }));
      
      // Schedule snooze alarm
      const snoozeTime = new Date();
      snoozeTime.setMinutes(snoozeTime.getMinutes() + (currentAlarm.snoozeDuration || 5));
      
      const snoozeTimeString = `${snoozeTime.getHours().toString().padStart(2, '0')}:${snoozeTime.getMinutes().toString().padStart(2, '0')}`;
      
      const snoozedAlarm: Alarm = {
        ...currentAlarm,
        time: snoozeTimeString,
        currentSnoozeCount: currentCount + 1
      };
  
      AlarmScheduler.scheduleAlarm(snoozedAlarm);
      AlarmScheduler.stopAlarmSound();
      setActiveAlarm(null);
      setTriggeredAlarm(null);
      toast.info(`Alarm snoozed for ${currentAlarm.snoozeDuration || 5} minutes`);
    }
  };

  // Show real triggered alarm screen
  if (triggeredAlarm) {
    return (
      <AlarmTriggeredScreen
        alarm={triggeredAlarm}
        onDismiss={handleDismissAlarm}
        onSnooze={triggeredAlarm.snoozeEnabled ? handleSnoozeAlarm : undefined}
      />
    );
  }

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
                selectedMissions={alarm.selectedMissions}
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
                Test Alarm {alarm.missionEnabled ? `(${alarm.selectedMissions?.length || 0} missions)` : '(No missions)'}
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
          selectedMissions={activeAlarm.selectedMissions || []}
          snoozeEnabled={activeAlarm.snoozeEnabled ?? true}
          snoozeDuration={activeAlarm.snoozeDuration || 5}
          maxSnoozes={activeAlarm.maxSnoozes ?? -1}
          currentSnoozeCount={snoozeCounts[activeAlarm.id] || 0}
          wakeUpCheckEnabled={activeAlarm.wakeUpCheckEnabled || false}
          wakeUpCheckType={activeAlarm.wakeUpCheckType || 'math'}
          soundPowerUp={activeAlarm.volume || 80}
          onDismiss={handleDismissAlarm}
          onSnooze={handleSnoozeAlarm}
        />
      )}
    </div>
  );
};

export default Index;
