import { useState } from "react";
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
import { Plus, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

interface AddAlarmDialogProps {
  onAddAlarm: (alarm: {
    time: string;
    label: string;
    isActive: boolean;
    repeatDays: string[];
    soundName: string;
  }) => void;
}

export const AddAlarmDialog = ({ onAddAlarm }: AddAlarmDialogProps) => {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("07:00");
  const [label, setLabel] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  const [soundName, setSoundName] = useState("Motivational Dawn");

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const motivationalSounds = [
    "Motivational Dawn",
    "Rise & Shine",
    "Power Morning",
    "Victory Bell",
    "Success Chimes",
    "Champion's Call",
    "Morning Thunder",
    "Triumph Melody"
  ];

  const handleDayToggle = (dayIndex: number) => {
    const dayName = dayNames[dayIndex];
    setRepeatDays(prev => 
      prev.includes(dayName) 
        ? prev.filter(d => d !== dayName)
        : [...prev, dayName]
    );
  };

  const handleSave = () => {
    onAddAlarm({
      time,
      label,
      isActive,
      repeatDays,
      soundName,
    });
    setOpen(false);
    setTime("07:00");
    setLabel("");
    setRepeatDays([]);
    setSoundName("Motivational Dawn");
  };

  const handleCustomSound = () => {
    // This would open file picker in a real app
    alert("Custom sound upload feature - would open file picker");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogTitle className="text-xl text-center">New Alarm</DialogTitle>
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

          {/* Sound Selection */}
          <div className="space-y-3">
            <Label>Alarm Sound</Label>
            <div className="grid grid-cols-2 gap-2">
              {motivationalSounds.map((sound) => (
                <Button
                  key={sound}
                  variant={soundName === sound ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSoundName(sound)}
                  className={`text-xs ${
                    soundName === sound
                      ? 'bg-primary text-primary-foreground'
                      : 'border-border/50'
                  }`}
                >
                  {sound}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={handleCustomSound}
              className="w-full border-border/50"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Custom Sound
            </Button>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="active">Active</Label>
            <Switch
              id="active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            Save Alarm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};