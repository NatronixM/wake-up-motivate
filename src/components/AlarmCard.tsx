import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Clock, Volume2, Repeat, Zap } from "lucide-react";
import { AlarmContextMenu } from "./AlarmContextMenu";
import { Badge } from "@/components/ui/badge";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { defaultTracks } from "@/data/motivationalTracks";

interface AlarmCardProps {
  id: string;
  time: string;
  label?: string;
  isActive: boolean;
  repeatDays?: string[];
  soundName?: string;
  missionEnabled?: boolean;
  missionCount?: number;
  onToggle: (id: string, active: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSkipOnce?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export const AlarmCard = ({
  id,
  time,
  label,
  isActive,
  repeatDays = [],
  soundName = "Default",
  missionEnabled = false,
  missionCount = 0,
  onToggle,
  onEdit,
  onDelete,
  onSkipOnce,
  onDuplicate,
}: AlarmCardProps) => {
  const [isEnabled, setIsEnabled] = useState(isActive);
  const { play, stop, isPlaying } = useAudioPlayer();

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    onToggle(id, checked);
  };

  const handlePreview = () => {
    // Find the track by name
    const track = defaultTracks.find(t => t.name === soundName);
    if (track) {
      if (isPlaying) {
        stop();
      } else {
        play(track.url, 0.5);
      }
    }
  };

  const handleSkipOnce = () => {
    if (onSkipOnce) {
      onSkipOnce(id);
    }
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(id);
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return { time: `${displayHour}:${minutes}`, period };
  };

  const { time: displayTime, period } = formatTime(time);

  return (
    <Card className="bg-gradient-card border-border/50 p-6 shadow-card backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-light text-foreground">
              {displayTime}
            </span>
            <span className="text-lg text-muted-foreground font-medium">
              {period}
            </span>
          </div>
          
          {label && (
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          )}
          
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {repeatDays.length > 0 && (
              <div className="flex items-center gap-1">
                <Repeat className="h-3 w-3" />
                <span>{repeatDays.join(', ')}</span>
              </div>
            )}
            
            {missionEnabled && (
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  Mission ✕{missionCount}
                </Badge>
              </div>
            )}
            
            <div className="flex items-center gap-1">
              <Volume2 className="h-3 w-3" />
              <span>{soundName}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={isEnabled}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-primary"
          />
          
          <AlarmContextMenu
            onEdit={() => onEdit(id)}
            onDelete={() => onDelete(id)}
            onPreview={handlePreview}
            onSkipOnce={handleSkipOnce}
            onDuplicate={handleDuplicate}
          />
        </div>
      </div>
    </Card>
  );
};