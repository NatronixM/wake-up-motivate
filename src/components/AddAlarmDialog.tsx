import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Upload, Volume2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TimePickerDialog } from "./TimePickerDialog";
import { defaultTracks } from "@/data/motivationalTracks";

interface Alarm {
  id: string;
  time: string;
  label?: string;
  isActive: boolean;
  repeatDays?: string[];
  soundName?: string;
  missionEnabled?: boolean;
  missionCount?: number;
  snoozeEnabled?: boolean;
  snoozeDuration?: number;
  volume?: number;
}

interface AddAlarmDialogProps {
  onAddAlarm: (alarm: {
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
  }) => void;
  editingAlarm?: Alarm | null;
  onUpdateAlarm?: (alarm: {
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
  }) => void;
  onCancelEdit?: () => void;
}

export const AddAlarmDialog = ({ 
  onAddAlarm, 
  editingAlarm, 
  onUpdateAlarm, 
  onCancelEdit 
}: AddAlarmDialogProps) => {
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [time, setTime] = useState(editingAlarm?.time || "07:00");
  const [label, setLabel] = useState(editingAlarm?.label || "");
  const [isActive, setIsActive] = useState(editingAlarm?.isActive ?? true);
  const [repeatDays, setRepeatDays] = useState<string[]>(editingAlarm?.repeatDays || []);
  const [soundName, setSoundName] = useState(editingAlarm?.soundName || "Rise & Shine");

  // Open the appropriate dialog when editing
  useEffect(() => {
    if (editingAlarm) {
      setTimePickerOpen(true);
    }
  }, [editingAlarm]);

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get free tracks for quick add
  const freeTracks = defaultTracks.filter(track => !track.isPremium);

  const handleDayToggle = (dayIndex: number) => {
    const dayName = dayNames[dayIndex];
    setRepeatDays(prev => 
      prev.includes(dayName) 
        ? prev.filter(d => d !== dayName)
        : [...prev, dayName]
    );
  };

  const handleQuickSave = () => {
    onAddAlarm({
      time,
      label,
      isActive,
      repeatDays,
      soundName,
    });
    setQuickAddOpen(false);
    setTime("07:00");
    setLabel("");
    setRepeatDays([]);
    setSoundName("Rise & Shine");
  };

  const handleAdvancedSave = (alarmData: any) => {
    if (editingAlarm && onUpdateAlarm) {
      onUpdateAlarm(alarmData);
    } else {
      onAddAlarm(alarmData);
    }
  };

  const handleCancelEdit = () => {
    setTimePickerOpen(false);
    if (onCancelEdit) {
      onCancelEdit();
    }
  };

  const openAdvancedEditor = () => {
    setQuickAddOpen(false);
    setTimePickerOpen(true);
  };

  const handleCustomSound = () => {
    // This would open file picker in a real app
    alert("Custom sound upload feature - would open file picker");
  };

  return (
    <>
      <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 shadow-glow h-14 px-8 rounded-full"
          >
            <Plus className="h-6 w-6 mr-2" />
            Add Alarm
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Quick Add Alarm</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Time Picker */}
            <div className="text-center">
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-4xl font-light text-center border-none bg-transparent text-foreground h-16"
              />
            </div>

            {/* Label */}
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Morning workout"
                className="bg-secondary/50 border-border/50"
              />
            </div>

            {/* Alarm Sound */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Alarm Sound
              </Label>
              <Select value={soundName} onValueChange={setSoundName}>
                <SelectTrigger className="bg-secondary/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {freeTracks.map((track) => (
                    <SelectItem key={track.id} value={track.name}>
                      {track.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Repeat Days */}
            <div className="space-y-3">
              <Label>Repeat</Label>
              <div className="flex gap-2">
                {days.map((day, index) => (
                  <Button
                    key={index}
                    variant={repeatDays.includes(dayNames[index]) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDayToggle(index)}
                    className={`w-10 h-10 rounded-full p-0 ${
                      repeatDays.includes(dayNames[index])
                        ? 'bg-primary text-primary-foreground'
                        : 'border-border/50'
                    }`}
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleQuickSave}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                Quick Save
              </Button>
              
              <Button
                onClick={openAdvancedEditor}
                variant="outline"
                className="w-full border-border/50"
              >
                Advanced Settings
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TimePickerDialog
        open={timePickerOpen}
        onOpenChange={editingAlarm ? handleCancelEdit : setTimePickerOpen}
        initialTime={time}
        initialLabel={label}
        initialRepeatDays={repeatDays}
        initialSoundName={soundName}
        onSave={handleAdvancedSave}
      />
    </>
  );
};