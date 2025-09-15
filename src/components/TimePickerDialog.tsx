import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

interface TimePickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialTime: string; // HH:MM format
  onTimeSelect: (time: string) => void;
  title?: string;
}

export const TimePickerDialog = ({
  isOpen,
  onClose,
  initialTime,
  onTimeSelect,
  title = "Set Time"
}: TimePickerDialogProps) => {
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

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

  const handleConfirm = () => {
    // Convert back to 24-hour format
    let hour24 = selectedHour;
    if (selectedPeriod === 'AM' && selectedHour === 12) {
      hour24 = 0;
    } else if (selectedPeriod === 'PM' && selectedHour !== 12) {
      hour24 = selectedHour + 12;
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onTimeSelect(timeString);
    onClose();
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Clock className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="flex items-center justify-center gap-4">
            {/* Hours */}
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">Hour</div>
              <ScrollArea className="h-32 w-16 border border-border rounded-lg">
                <div className="p-1">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      variant={selectedHour === hour ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full mb-1 h-8 ${
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

            <div className="text-2xl font-bold text-muted-foreground mt-6">:</div>

            {/* Minutes */}
            <div className="text-center">
              <div className="text-sm font-medium text-muted-foreground mb-2">Minute</div>
              <ScrollArea className="h-32 w-16 border border-border rounded-lg">
                <div className="p-1">
                  {minutes.map((minute) => (
                    <Button
                      key={minute}
                      variant={selectedMinute === minute ? "secondary" : "ghost"}
                      size="sm"
                      className={`w-full mb-1 h-8 ${
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
              <div className="space-y-2">
                <Button
                  variant={selectedPeriod === 'AM' ? "secondary" : "ghost"}
                  size="sm"
                  className={`w-16 h-8 ${
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
                  className={`w-16 h-8 ${
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
        </div>

        {/* Current Selection Display */}
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-foreground">
            {selectedHour}:{selectedMinute.toString().padStart(2, '0')} {selectedPeriod}
          </div>
          <div className="text-sm text-muted-foreground">
            Selected Time
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Set Time
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};