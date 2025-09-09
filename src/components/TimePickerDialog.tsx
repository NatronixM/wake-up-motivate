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
import { Volume2, VolumeX, Smartphone } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { TrackSelector } from "./TrackSelector";
import { WallpaperSelector } from "./WallpaperSelector";
import { useWallpapers } from "@/hooks/useWallpapers";
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
    volume: number;
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
  initialWallpaper,
  onSave,
}: TimePickerDialogProps) => {
  const { customWallpapers, addCustomWallpaper } = useWallpapers();
  const [time, setTime] = useState(initialTime);
  const [label, setLabel] = useState(initialLabel);
  const [repeatDays, setRepeatDays] = useState<string[]>(initialRepeatDays);
  const [selectedTrack, setSelectedTrack] = useState<MotivationalTrack | null>(
    defaultTracks.find(track => track.name === initialSoundName) || defaultTracks[0]
  );
  const [missionEnabled, setMissionEnabled] = useState(initialMissionEnabled);
  const [missionCount, setMissionCount] = useState(3);
  const [snoozeEnabled, setSnoozeEnabled] = useState(true);
  const [snoozeDuration, setSnoozeDuration] = useState(5);
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
    { name: "Math Problems", icon: "🧮", count: missionCount },
    { name: "Memory Game", icon: "🧠", count: missionCount },
    { name: "Barcode Scan", icon: "📱", count: missionCount },
    { name: "Shake Phone", icon: "📳", count: missionCount },
    { name: "Photo Taking", icon: "📷", count: missionCount },
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
      volume: volume[0],
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
                  {missionTypes.slice(0, 3).map((mission, index) => (
                    <Card key={mission.name} className={`p-3 text-center border ${
                      index === 0 ? 'bg-primary/20 border-primary' : 'border-dashed border-border'
                    }`}>
                      <div className="text-2xl mb-1">{mission.icon}</div>
                      <div className="text-xs">{mission.count} time(s)</div>
                    </Card>
                  ))}
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
            />
          </div>

          {/* Sound Power-up */}
          <div className="flex items-center justify-between">
            <Label>Sound power-up</Label>
            <span className="text-sm text-muted-foreground">1 in use →</span>
          </div>

          {/* Snooze */}
          <div className="flex items-center justify-between">
            <Label>Snooze</Label>
            <span className="text-sm text-muted-foreground">5 min, Unlimited →</span>
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
          <div className="flex items-center justify-between">
            <Label>Wake up check 🔒</Label>
            <span className="text-muted-foreground">→</span>
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