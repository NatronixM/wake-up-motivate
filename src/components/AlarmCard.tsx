import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Clock, Volume2, Repeat, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AlarmCardProps {
  id: string;
  time: string;
  label?: string;
  isActive: boolean;
  repeatDays?: string[];
  soundName?: string;
  onToggle: (id: string, active: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const AlarmCard = ({
  id,
  time,
  label,
  isActive,
  repeatDays = [],
  soundName = "Default",
  onToggle,
  onEdit,
  onDelete,
}: AlarmCardProps) => {
  const [isEnabled, setIsEnabled] = useState(isActive);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    onToggle(id, checked);
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={() => onEdit(id)}>
                <Clock className="h-4 w-4 mr-2" />
                Edit Alarm
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};