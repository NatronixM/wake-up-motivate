import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX, Smartphone, Calculator, Brain, Vibrate, Camera } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { TrackSelector } from "./TrackSelector";
import { WallpaperSelector } from "./WallpaperSelector";
import { useWallpapers } from "@/hooks/useWallpapers";
import { useCustomTracks } from "@/hooks/useCustomTracks";
import { MotivationalTrack, defaultTracks } from "@/data/motivationalTracks";

interface Wallpaper {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  value: string;
  preview?: string;
}

interface TimePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTime: string;
  initialLabel?: string;
  initialRepeatDays?: string[];
  initialSoundName?: string;
  initialMissionEnabled?: boolean;
  initialSoundPowerUp?: number;
  initialSnoozeEnabled?: boolean;
  initialSnoozeDuration?: number;
  initialMaxSnoozes?: number;
  initialWakeUpCheckEnabled?: boolean;
  initialWakeUpCheckType?: 'math' | 'memory' | 'shake' | 'photo' | 'barcode';
  initialWallpaper?: Wallpaper;
  onSave: (alarm: {
    time: string;
    label: string;
    isActive: boolean;
    repeatDays: string[];
    soundName: string;
    missionEnabled: boolean;
    missionCount: number;
    snoozeEnabled: boolean;
    snoozeDuration: number;
    maxSnoozes: number;
    soundPowerUp: number;
    volume: number;
    wakeUpCheckEnabled: boolean;
    wakeUpCheckType: 'math' | 'memory' | 'shake' | 'photo' | 'barcode';
    wallpaper?: Wallpaper;
  }) => void;
}

export const TimePickerDialog = ({
  open,
  onOpenChange,
  initialTime,
  initialLabel = "",
  initialRepeatDays = [],
  initialSoundName = "Rise & Shine",
  initialMissionEnabled = false,
  initialSoundPowerUp = 10,
  initialSnoozeEnabled = true,
  initialSnoozeDuration = 5,
  initialMaxSnoozes = -1,
  initialWakeUpCheckEnabled = false,
  initialWakeUpCheckType = 'math',
  initialWallpaper,
  onSave,
}: TimePickerDialogProps) => {
  const { customWallpapers, addCustomWallpaper } = useWallpapers();
  const { customTracks, addCustomTrack, deleteCustomTrack } = useCustomTracks();
  const [time, setTime] = useState(initialTime);
  const [label, setLabel] = useState(initialLabel);
  const [repeatDays, setRepeatDays] = useState<string[]>(initialRepeatDays);
  const [selectedTrack, setSelectedTrack] = useState<MotivationalTrack | null>(
    defaultTracks.find(track => track.name === initialSoundName) || defaultTracks[0]
  );
  const [missionEnabled, setMissionEnabled] = useState(initialMissionEnabled);
  const [missionCount, setMissionCount] = useState(3);
  const [snoozeEnabled, setSnoozeEnabled] = useState(true);
  const [snoozeDuration, setSnoozeDuration] = useState(initialSnoozeDuration);
  const [maxSnoozes, setMaxSnoozes] = useState(initialMaxSnoozes);
  const [soundPowerUp, setSoundPowerUp] = useState(initialSoundPowerUp);
  const [wakeUpCheckEnabled, setWakeUpCheckEnabled] = useState(initialWakeUpCheckEnabled);
  const [wakeUpCheckType, setWakeUpCheckType] = useState<'math' | 'memory' | 'shake' | 'photo' | 'barcode'>(initialWakeUpCheckType);
  const [volume, setVolume] = useState([80]);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | undefined>(initialWallpaper);
  const [wallpaperSelectorOpen, setWallpaperSelectorOpen] = useState(false);

  // Parse time for display
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const missionTypes = [
    { name: "Math Problems", icon: Calculator, count: missionCount },
    { name: "Memory Game", icon: Brain, count: missionCount },
    { name: "Barcode Scan", icon: Smartphone, count: missionCount },
    { name: "Shake Phone", icon: Vibrate, count: missionCount },
    { name: "Photo Taking", icon: Camera, count: missionCount },
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
    onSave({
      time,
      label,
      isActive: true,
      repeatDays,
      soundName: selectedTrack?.name || "Rise & Shine",
      missionEnabled,
      missionCount,
      snoozeEnabled,
      snoozeDuration,
      maxSnoozes,
      soundPowerUp,
      volume: volume[0],
      wakeUpCheckEnabled,
      wakeUpCheckType,
      wallpaper: selectedWallpaper,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-muted-foreground">
            Ring in 12 hr. 6 min
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Time Display */}
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center gap-4 text-6xl font-light text-foreground">
              <span>{displayHour}</span>
              <span>:</span>
              <span>{minutes}</span>
              <span className="text-3xl text-muted-foreground">{period}</span>
            </div>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="sr-only"
            />
          </div>

          {/* Daily Repeat */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-lg">Daily</Label>
              <Badge variant="secondary" className="bg-primary text-primary-foreground">
                Daily
              </Badge>
            </div>
            <div className="flex gap-2 justify-center">
              {days.map((day, index) => (
                <Button
                  key={index}
                  variant={repeatDays.includes(dayNames[index]) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleDayToggle(index)}
                  className={`w-12 h-12 rounded-full p-0 ${
                    repeatDays.includes(dayNames[index])
                      ? 'bg-primary border-primary text-primary-foreground'
                      : 'border-primary text-primary hover:bg-primary/10'
                  }`}
                >
                  {day}
                </Button>
              ))}
            </div>
          </div>

          {/* Mission Section */}
          <Card className="bg-gradient-card p-4 border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Mission</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">1/5</span>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className={`w-3 h-3 rounded-full ${
                          i === 0 ? 'bg-primary' : 'bg-muted border border-border'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {missionEnabled && (
                <div className="grid grid-cols-3 gap-3">
                  {missionTypes.slice(0, 3).map((mission, index) => {
                    const IconComponent = mission.icon;
                    return (
                      <Card key={mission.name} className={`p-3 text-center border ${
                        index === 0 ? 'bg-primary/20 border-primary' : 'border-dashed border-border'
                      }`}>
                        <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                        <div className="text-xs">{mission.count} time(s)</div>
                      </Card>
                    );
                  })}
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Label htmlFor="mission">Enable Mission</Label>
                <Switch
                  id="mission"
                  checked={missionEnabled}
                  onCheckedChange={setMissionEnabled}
                />
              </div>
            </div>
          </Card>

          {/* Volume Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <VolumeX className="h-5 w-5" />
              <Slider
                value={volume}
                onValueChange={setVolume}
                max={100}
                step={1}
                className="flex-1"
              />
              <Volume2 className="h-5 w-5" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Vibration</Label>
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <Switch
                  checked={vibrationEnabled}
                  onCheckedChange={setVibrationEnabled}
                />
              </div>
            </div>
          </div>

          {/* Sound Selection */}
          <div className="space-y-3">
            <Label>Sound</Label>
            <TrackSelector
              selectedTrackId={selectedTrack?.id}
              onTrackSelect={setSelectedTrack}
              showPremiumTracks={true}
              customTracks={customTracks}
              onCustomTrackAdded={addCustomTrack}
              onCustomTrackDeleted={deleteCustomTrack}
            />
          </div>

          {/* Sound Power-up */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Sound power-up</Label>
              <Badge variant="secondary">{soundPowerUp}% increase</Badge>
            </div>
            <Slider
              value={[soundPowerUp]}
              onValueChange={(value) => setSoundPowerUp(value[0])}
              max={50}
              min={0}
              step={5}
              className="w-full"
            />
          </div>

          {/* Snooze */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Snooze</Label>
              <Switch
                checked={snoozeEnabled}
                onCheckedChange={setSnoozeEnabled}
              />
            </div>
            {snoozeEnabled && (
              <div className="space-y-3 pl-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Duration (minutes)</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSnoozeDuration(Math.max(1, snoozeDuration - 1))}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="w-8 text-center text-sm">{snoozeDuration}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSnoozeDuration(Math.min(30, snoozeDuration + 1))}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Max snoozes</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMaxSnoozes(maxSnoozes === -1 ? 10 : Math.max(1, maxSnoozes - 1))}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="w-16 text-center text-sm">
                      {maxSnoozes === -1 ? 'Unlimited' : maxSnoozes}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setMaxSnoozes(maxSnoozes === -1 ? -1 : Math.min(20, maxSnoozes + 1))}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMaxSnoozes(-1)}
                      className="text-xs"
                    >
                      ∞
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Label */}
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="remember to log off ..."
              className="bg-secondary/50 border-border/50"
            />
          </div>

          {/* Wake up check */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Wake up check</Label>
              <Switch
                checked={wakeUpCheckEnabled}
                onCheckedChange={setWakeUpCheckEnabled}
              />
            </div>
            {wakeUpCheckEnabled && (
              <div className="pl-4">
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

          {/* Alarm wallpaper */}
          <div className="flex items-center justify-between">
            <Label>Alarm wallpaper</Label>
            <Button
              variant="ghost"
              className="p-1 h-auto"
              onClick={() => setWallpaperSelectorOpen(true)}
            >
              <div className="w-12 h-8 rounded overflow-hidden border border-border/50">
                {selectedWallpaper ? (
                  selectedWallpaper.type === 'gradient' ? (
                    <div
                      className="w-full h-full"
                      style={{ background: selectedWallpaper.value }}
                    />
                  ) : (
                    <img
                      src={selectedWallpaper.preview || selectedWallpaper.value}
                      alt={selectedWallpaper.name}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gradient-to-b from-orange-400 to-pink-400" />
                )}
              </div>
            </Button>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-red-500 hover:bg-red-600 text-white text-lg py-6 rounded-xl"
          >
            Save
          </Button>
        </div>

        {/* Wallpaper Selector Dialog */}
        <WallpaperSelector
          open={wallpaperSelectorOpen}
          onOpenChange={setWallpaperSelectorOpen}
          selectedWallpaper={selectedWallpaper}
          onWallpaperSelect={setSelectedWallpaper}
          customWallpapers={customWallpapers}
          onAddCustomWallpaper={addCustomWallpaper}
        />
      </DialogContent>
    </Dialog>
  );
};