import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX, Clock, Calculator, Brain, Vibrate, Camera, Smartphone } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { TrackSelector } from "./TrackSelector";
import { useCustomTracks } from "@/hooks/useCustomTracks";

interface BedtimeReminder {
  id: string;
  time: string;
  label: string;
  isActive: boolean;
  repeatDays: string[];
  soundName: string;
  volume: number;
  soundPowerUp?: number;
  snoozeEnabled?: boolean;
  snoozeDuration?: number;
  maxSnoozes?: number;
  wakeUpCheckEnabled?: boolean;
  wakeUpCheckType?: 'math' | 'memory' | 'shake' | 'photo';
  wallpaper?: {
    id: string;
    name: string;
    type: 'gradient' | 'image';
    value: string;
    preview?: string;
  };
}

interface BedtimeReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reminder?: BedtimeReminder | null;
  onSave: (reminder: Omit<BedtimeReminder, 'id'>) => void;
}

export const BedtimeReminderDialog = ({ open, onOpenChange, reminder, onSave }: BedtimeReminderDialogProps) => {
  const { customTracks, addCustomTrack, deleteCustomTrack } = useCustomTracks();
  const [time, setTime] = useState(reminder?.time || '22:00');
  const [label, setLabel] = useState(reminder?.label || 'Bedtime reminder');
  const [isActive, setIsActive] = useState(reminder?.isActive ?? true);
  const [repeatDays, setRepeatDays] = useState<string[]>(reminder?.repeatDays || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [soundName, setSoundName] = useState(reminder?.soundName || 'Peaceful Dreams');
  const [volume, setVolume] = useState(reminder?.volume || 70);
  const [soundPowerUp, setSoundPowerUp] = useState(reminder?.soundPowerUp || 0);
  const [snoozeEnabled, setSnoozeEnabled] = useState(reminder?.snoozeEnabled ?? false);
  const [snoozeDuration, setSnoozeDuration] = useState(reminder?.snoozeDuration || 10);
  const [maxSnoozes, setMaxSnoozes] = useState(reminder?.maxSnoozes || 3);
  const [wakeUpCheckEnabled, setWakeUpCheckEnabled] = useState(reminder?.wakeUpCheckEnabled ?? false);
  const [wakeUpCheckType, setWakeUpCheckType] = useState<'math' | 'memory' | 'shake' | 'photo'>(reminder?.wakeUpCheckType || 'math');
  const [wallpaper, setWallpaper] = useState(reminder?.wallpaper || null);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayToggle = (dayIndex: number) => {
    const dayName = dayNames[dayIndex];
    if (repeatDays.includes(dayName)) {
      setRepeatDays(prev => prev.filter(day => day !== dayName));
    } else {
      setRepeatDays(prev => [...prev, dayName]);
    }
  };

  const handleSave = () => {
    onSave({
      time,
      label,
      isActive,
      repeatDays,
      soundName,
      volume,
      soundPowerUp,
      snoozeEnabled,
      snoozeDuration,
      maxSnoozes,
      wakeUpCheckEnabled,
      wakeUpCheckType,
      wallpaper: wallpaper || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{reminder ? 'Edit Bedtime Reminder' : 'New Bedtime Reminder'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Time and Label */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Bedtime reminder"
              />
            </div>
          </div>

          {/* Repeat Days */}
          <div>
            <Label className="text-sm mb-2 block">Repeat</Label>
            <div className="flex gap-2">
              {dayNames.map((day, index) => (
                <Button
                  key={day}
                  variant={repeatDays.includes(day) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDayToggle(index)}
                  className="w-12 h-12 rounded-full p-0"
                >
                  {day.charAt(0)}
                </Button>
              ))}
            </div>
          </div>

          {/* Sound Settings */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">Alarm Sound</Label>
              <TrackSelector 
                selectedTrackId={soundName}
                onTrackSelect={(track) => setSoundName(track.name)}
                showPremiumTracks={true}
                customTracks={customTracks}
                onCustomTrackAdded={addCustomTrack}
                onCustomTrackDeleted={deleteCustomTrack}
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block">Volume ({volume}%)</Label>
              <div className="flex items-center gap-2">
                <VolumeX className="h-4 w-4" />
                <Slider
                  value={[volume]}
                  onValueChange={(value) => setVolume(value[0])}
                  max={100}
                  step={10}
                  className="flex-1"
                />
                <Volume2 className="h-4 w-4" />
              </div>
            </div>

            <div>
              <Label className="text-sm mb-2 block">Sound Power Up ({soundPowerUp}%)</Label>
              <div className="space-y-2">
                <Slider
                  value={[soundPowerUp]}
                  onValueChange={(value) => setSoundPowerUp(value[0])}
                  max={50}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Volume increases gradually over time
                </p>
              </div>
            </div>
          </div>

          {/* Snooze Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Enable Snooze</Label>
              <Switch checked={snoozeEnabled} onCheckedChange={setSnoozeEnabled} />
            </div>
            
            {snoozeEnabled && (
              <div className="space-y-3 ml-4">
                <div>
                  <Label className="text-sm mb-2 block">Snooze Duration (minutes)</Label>
                  <Slider
                    value={[snoozeDuration]}
                    onValueChange={(value) => setSnoozeDuration(value[0])}
                    min={1}
                    max={30}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">{snoozeDuration} minutes</div>
                </div>
                
                <div>
                  <Label className="text-sm mb-2 block">Max Snoozes</Label>
                  <div className="flex gap-2">
                    {[1, 3, 5, 10, -1].map((count) => (
                      <Button
                        key={count}
                        variant={maxSnoozes === count ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMaxSnoozes(count)}
                        className="text-xs"
                      >
                        {count === -1 ? '∞' : count}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Wake Up Check Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Wake Up Check</Label>
              <Switch checked={wakeUpCheckEnabled} onCheckedChange={setWakeUpCheckEnabled} />
            </div>
            
            {wakeUpCheckEnabled && (
              <div className="space-y-3 ml-4">
                <Label className="text-sm mb-2 block">Check type</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'math', label: 'Math', icon: Calculator },
                    { value: 'memory', label: 'Memory', icon: Brain },
                    { value: 'shake', label: 'Shake', icon: Vibrate },
                    { value: 'photo', label: 'Photo', icon: Camera },
                  ].map((type) => {
                    const IconComponent = type.icon;
                    return (
                      <Button
                        key={type.value}
                        variant={wakeUpCheckType === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setWakeUpCheckType(type.value as any)}
                        className="justify-start gap-2"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{type.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Wallpaper Settings */}
          <div>
            <Label className="text-sm mb-2 block">Background</Label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {[
                { id: 'aurora', name: 'Aurora', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' },
                { id: 'sunrise', name: 'Sunrise', value: 'linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)' },
                { id: 'ocean', name: 'Ocean', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
              ].map((preset) => (
                <Card
                  key={preset.id}
                  className={`p-2 cursor-pointer border-2 ${
                    wallpaper?.id === preset.id ? 'border-primary' : 'border-border'
                  }`}
                  onClick={() => setWallpaper({ 
                    id: preset.id, 
                    name: preset.name, 
                    type: 'gradient', 
                    value: preset.value 
                  })}
                >
                  <div
                    className="w-full h-12 rounded"
                    style={{ background: preset.value }}
                  />
                  <p className="text-xs text-center mt-1">{preset.name}</p>
                </Card>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setWallpaper(null)}
            >
              Default
            </Button>
          </div>

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full">
            {reminder ? 'Update Reminder' : 'Create Reminder'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};