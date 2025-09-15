import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Volume2, Play, Pause, Zap, Calculator, Smartphone, Camera, BarChart3 } from "lucide-react";
import { defaultTracks } from "@/data/motivationalTracks";
import { toast } from "sonner";

interface Wallpaper {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  value: string;
  preview?: string;
}

interface AlarmEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTime: string;
  initialLabel?: string;
  initialRepeatDays?: string[];
  initialSoundName?: string;
  initialMissionEnabled?: boolean;
  initialMissionCount?: number;
  initialSnoozeEnabled?: boolean;
  initialSnoozeDuration?: number;
  initialMaxSnoozes?: number;
  initialSoundPowerUp?: number;
  initialVolume?: number;
  initialWakeUpCheckEnabled?: boolean;
  initialWakeUpCheckType?: 'math' | 'memory' | 'shake' | 'photo' | 'barcode';
  initialWallpaper?: Wallpaper;
  onSave: (alarmData: {
    time: string;
    label: string;
    isActive: boolean;
    repeatDays: string[];
    soundName: string;
    missionEnabled?: boolean;
    missionCount?: number;
    snoozeEnabled?: boolean;
    snoozeDuration?: number;
    maxSnoozes?: number;
    soundPowerUp?: number;
    volume?: number;
    wakeUpCheckEnabled?: boolean;
    wakeUpCheckType?: 'math' | 'memory' | 'shake' | 'photo' | 'barcode';
    wallpaper?: Wallpaper;
  }) => void;
  title?: string;
}

export const AlarmEditDialog = ({
  isOpen,
  onClose,
  initialTime,
  initialLabel = "",
  initialRepeatDays = [],
  initialSoundName = "Rise & Shine",
  initialMissionEnabled = false,
  initialMissionCount = 1,
  initialSnoozeEnabled = true,
  initialSnoozeDuration = 5,
  initialMaxSnoozes = 3,
  initialSoundPowerUp = 0,
  initialVolume = 80,
  initialWakeUpCheckEnabled = false,
  initialWakeUpCheckType = 'math',
  initialWallpaper,
  onSave,
  title = "Edit Alarm"
}: AlarmEditDialogProps) => {
  // Time picker state
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  
  // Alarm settings state
  const [label, setLabel] = useState(initialLabel);
  const [repeatDays, setRepeatDays] = useState<string[]>(initialRepeatDays);
  const [soundName, setSoundName] = useState(initialSoundName);
  const [missionEnabled, setMissionEnabled] = useState(initialMissionEnabled);
  const [missionCount, setMissionCount] = useState(initialMissionCount);
  const [snoozeEnabled, setSnoozeEnabled] = useState(initialSnoozeEnabled);
  const [snoozeDuration, setSnoozeDuration] = useState(initialSnoozeDuration);
  const [maxSnoozes, setMaxSnoozes] = useState(initialMaxSnoozes);
  const [soundPowerUp, setSoundPowerUp] = useState(initialSoundPowerUp);
  const [volume, setVolume] = useState(initialVolume);
  const [wakeUpCheckEnabled, setWakeUpCheckEnabled] = useState(initialWakeUpCheckEnabled);
  const [wakeUpCheckType, setWakeUpCheckType] = useState<'math' | 'memory' | 'shake' | 'photo' | 'barcode'>(initialWakeUpCheckType);
  const [wallpaper, setWallpaper] = useState(initialWallpaper);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'energetic' | 'inspirational' | 'peaceful' | 'nature' | 'custom'>('all');

  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Convert 24-hour time to 12-hour format on mount
  useEffect(() => {
    if (initialTime) {
      const [hours, minutes] = initialTime.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      
      setSelectedHour(displayHour);
      setSelectedMinute(minutes);
      setSelectedPeriod(period);
    }
  }, [initialTime, isOpen]);

  const handleDayToggle = (dayIndex: number) => {
    const dayName = dayNames[dayIndex];
    setRepeatDays(prev => 
      prev.includes(dayName) 
        ? prev.filter(d => d !== dayName)
        : [...prev, dayName]
    );
  };

  const handlePreviewTrack = (trackName: string) => {
    const track = defaultTracks.find(t => t.name === trackName);
    if (!track) return;

    // If same track is playing, stop it
    if (playingPreview === trackName) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      setPlayingPreview(null);
      return;
    }

    // Stop any previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    const audio = new Audio(track.url);
    audio.volume = 1.0;
    audioRef.current = audio;
    setPlayingPreview(track.name);

    audio.play().catch(() => {
      setPlayingPreview(null);
      toast.error("Unable to play preview. Check your audio settings.");
    });

    audio.onended = () => {
      setPlayingPreview(null);
      if (audioRef.current) {
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  };

  // Stop preview when dialog closes or component unmounts
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
      setPlayingPreview(null);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, [isOpen]);
  const getWakeUpChallengeIcon = (type: string) => {
    switch (type) {
      case 'math': return Calculator;
      case 'memory': return BarChart3;
      case 'shake': return Smartphone;
      case 'photo': return Camera;
      case 'barcode': return BarChart3;
      default: return Calculator;
    }
  };

  const handleSave = () => {
    // Convert back to 24-hour format
    let hour24 = selectedHour;
    if (selectedPeriod === 'AM' && selectedHour === 12) {
      hour24 = 0;
    } else if (selectedPeriod === 'PM' && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    
    onSave({
      time: timeString,
      label,
      isActive: true,
      repeatDays,
      soundName,
      missionEnabled,
      missionCount,
      snoozeEnabled,
      snoozeDuration,
      maxSnoozes,
      soundPowerUp,
      volume,
      wakeUpCheckEnabled,
      wakeUpCheckType,
      wallpaper
    });
    onClose();
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Clock className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            {/* Time Picker */}
            <div className="space-y-3">
              <Label>Time</Label>
              <div className="flex items-center justify-center gap-4 p-4 bg-secondary/20 rounded-lg">
                {/* Hours */}
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Hour</div>
                  <ScrollArea className="h-24 w-16 border border-border rounded-lg">
                    <div className="p-1">
                      {hours.map((hour) => (
                        <Button
                          key={hour}
                          variant={selectedHour === hour ? "secondary" : "ghost"}
                          size="sm"
                          className={`w-full mb-1 h-6 text-xs ${
                            selectedHour === hour 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedHour(hour)}
                        >
                          {hour}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <div className="text-xl font-bold text-muted-foreground">:</div>

                {/* Minutes */}
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Min</div>
                  <ScrollArea className="h-24 w-16 border border-border rounded-lg">
                    <div className="p-1">
                      {minutes.filter(m => m % 5 === 0).map((minute) => (
                        <Button
                          key={minute}
                          variant={selectedMinute === minute ? "secondary" : "ghost"}
                          size="sm"
                          className={`w-full mb-1 h-6 text-xs ${
                            selectedMinute === minute 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => setSelectedMinute(minute)}
                        >
                          {minute.toString().padStart(2, '0')}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* AM/PM */}
                <div className="text-center">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Period</div>
                  <div className="space-y-1">
                    <Button
                      variant={selectedPeriod === 'AM' ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-12 h-6 text-xs ${
                        selectedPeriod === 'AM' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedPeriod('AM')}
                    >
                      AM
                    </Button>
                    <Button
                      variant={selectedPeriod === 'PM' ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-12 h-6 text-xs ${
                        selectedPeriod === 'PM' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedPeriod('PM')}
                    >
                      PM
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">
                  {selectedHour}:{selectedMinute.toString().padStart(2, '0')} {selectedPeriod}
                </div>
              </div>
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
              <Label>Repeat Days</Label>
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
              <Label className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Alarm Sound ({defaultTracks.length} tracks available)
              </Label>

              {/* Search and Category Filters */}
              <div className="flex flex-col gap-2">
                <Input
                  placeholder="Search tracks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-secondary/50 border-border/50"
                />
                <div className="flex flex-wrap gap-2">
                  {([
                    { key: 'all', label: 'All' },
                    { key: 'energetic', label: 'Energetic' },
                    { key: 'inspirational', label: 'Inspirational' },
                    { key: 'peaceful', label: 'Peaceful' },
                    { key: 'nature', label: 'Nature' },
                    { key: 'custom', label: 'Custom' },
                  ] as const).map(({ key, label }) => (
                    <Button
                      key={key}
                      size="sm"
                      variant={categoryFilter === key ? 'default' : 'outline'}
                      onClick={() => setCategoryFilter(key)}
                      className={categoryFilter === key ? 'bg-primary text-primary-foreground' : 'border-border/50'}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <ScrollArea className="max-h-80 border border-border rounded-lg p-3">
                <div className="space-y-2">
                  {defaultTracks
                    .filter((t) => (categoryFilter === 'all' ? true : t.category === categoryFilter))
                    .filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))
                    .map((track) => {
                      const formatDuration = (seconds: number) => {
                        const mins = Math.floor(seconds / 60);
                        const secs = seconds % 60;
                        return `${mins}:${secs.toString().padStart(2, '0')}`;
                      };
                      
                      return (
                        <div
                          key={track.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                            soundName === track.name 
                              ? 'bg-primary/10 border-primary shadow-sm' 
                              : 'border-border hover:bg-secondary/30'
                          }`}
                          onClick={() => setSoundName(track.name)}
                        >
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePreviewTrack(track.name);
                            }}
                            className="h-8 w-8 p-0 shrink-0 hover:bg-primary/20"
                          >
                            {playingPreview === track.name ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="font-medium text-sm truncate">{track.name}</h4>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground">
                                  {formatDuration(track.duration)}
                                </span>
                                {track.isPremium && (
                                  <span className="bg-gradient-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                    PRO
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground capitalize">
                                {track.category}
                              </span>
                              {track.description && (
                                <>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <span className="text-xs text-muted-foreground truncate">
                                    {track.description}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {soundName === track.name && (
                            <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
                          )}
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
              
              {soundName && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <Volume2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Selected: {soundName}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePreviewTrack(soundName)}
                    className="ml-auto h-7 px-3"
                  >
                    {playingPreview === soundName ? (
                      <>
                        <Pause className="h-3 w-3 mr-1" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Preview
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Wake Up Challenges */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Wake Up Challenge
                </Label>
                <Switch
                  checked={wakeUpCheckEnabled}
                  onCheckedChange={setWakeUpCheckEnabled}
                />
              </div>
              
              {wakeUpCheckEnabled && (
                <div className="space-y-3 pl-6">
                  <Label>Challenge Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: 'math', label: 'Math Problem', icon: Calculator },
                      { type: 'memory', label: 'Memory Game', icon: BarChart3 },
                      { type: 'shake', label: 'Shake Phone', icon: Smartphone },
                      { type: 'photo', label: 'Take Photo', icon: Camera }
                    ].map(({ type, label, icon: Icon }) => (
                      <Button
                        key={type}
                        variant={wakeUpCheckType === type ? "default" : "outline"}
                        className={`justify-start gap-2 ${
                          wakeUpCheckType === type 
                            ? 'bg-primary text-primary-foreground' 
                            : 'border-border/50'
                        }`}
                        onClick={() => setWakeUpCheckType(type as typeof wakeUpCheckType)}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Snooze Settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Enable Snooze</Label>
                <Switch
                  checked={snoozeEnabled}
                  onCheckedChange={setSnoozeEnabled}
                />
              </div>
              
              {snoozeEnabled && (
                <div className="space-y-3 pl-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Snooze Duration (minutes)</Label>
                      <Select value={snoozeDuration.toString()} onValueChange={(v) => setSnoozeDuration(Number(v))}>
                        <SelectTrigger className="bg-secondary/50 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 5, 10, 15].map(min => (
                            <SelectItem key={min} value={min.toString()}>{min} min</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Max Snoozes</Label>
                      <Select value={maxSnoozes.toString()} onValueChange={(v) => setMaxSnoozes(Number(v))}>
                        <SelectTrigger className="bg-secondary/50 border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 10].map(count => (
                            <SelectItem key={count} value={count.toString()}>{count}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Save Alarm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};