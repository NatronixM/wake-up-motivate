import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MathMission } from "./missions/MathMission";
import { MemoryGameMission } from "./missions/MemoryGameMission";
import { ShakeMission } from "./missions/ShakeMission";
import { PhotoMission } from "./missions/PhotoMission";
import { BarcodeMission } from "./missions/BarcodeMission";
import { AlarmClock, X } from "lucide-react";

interface AlarmDismissalScreenProps {
  alarmId: string;
  alarmLabel: string;
  alarmTime: string;
  missionEnabled: boolean;
  missionCount: number;
  onDismiss: () => void;
  onSnooze?: () => void;
}

const missionTypes = [
  { name: "Math Problems", component: MathMission },
  { name: "Memory Game", component: MemoryGameMission },
  { name: "Shake Phone", component: ShakeMission },
  { name: "Photo Taking", component: PhotoMission },
  { name: "Barcode Scan", component: BarcodeMission },
];

export const AlarmDismissalScreen = ({
  alarmId,
  alarmLabel,
  alarmTime,
  missionEnabled,
  missionCount,
  onDismiss,
  onSnooze
}: AlarmDismissalScreenProps) => {
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [selectedMissions, setSelectedMissions] = useState<number[]>([]);

  useEffect(() => {
    if (missionEnabled && missionCount > 0) {
      // Randomly select missions
      const shuffled = [...Array(missionTypes.length)].map((_, i) => i).sort(() => 0.5 - Math.random());
      setSelectedMissions(shuffled.slice(0, Math.min(missionCount, missionTypes.length)));
    }
  }, [missionEnabled, missionCount]);

  const handleMissionComplete = () => {
    const newCompleted = [...completedMissions, selectedMissions[currentMissionIndex]];
    setCompletedMissions(newCompleted);
    
    if (newCompleted.length >= selectedMissions.length) {
      // All missions completed
      setTimeout(() => onDismiss(), 1000);
    } else {
      // Move to next mission
      setCurrentMissionIndex(prev => prev + 1);
    }
  };

  const canDismissWithoutMissions = !missionEnabled || selectedMissions.length === 0;
  const progress = selectedMissions.length > 0 ? (completedMissions.length / selectedMissions.length) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Alarm Header */}
      <div className="bg-gradient-primary p-6 text-center text-white">
        <AlarmClock className="h-16 w-16 mx-auto mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold">{alarmTime}</h1>
        <p className="text-lg opacity-90">{alarmLabel}</p>
      </div>

      {/* Mission Progress */}
      {missionEnabled && selectedMissions.length > 0 && (
        <div className="p-4 bg-secondary/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Mission Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedMissions.length} / {selectedMissions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Mission Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {missionEnabled && selectedMissions.length > 0 ? (
          <div className="space-y-4">
            {selectedMissions.map((missionTypeIndex, index) => {
              const MissionComponent = missionTypes[missionTypeIndex].component;
              const isCompleted = completedMissions.includes(missionTypeIndex);
              const isCurrent = index === currentMissionIndex;
              
              if (!isCurrent && !isCompleted) return null;
              
              return (
                <div key={missionTypeIndex}>
                  <MissionComponent
                    onComplete={handleMissionComplete}
                    isCompleted={isCompleted}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <AlarmClock className="h-24 w-24 mx-auto mb-6 text-muted-foreground animate-pulse" />
            <h2 className="text-2xl font-bold mb-4">Good Morning! 🌅</h2>
            <p className="text-muted-foreground mb-6">
              Time to rise and thrive! Your day starts now.
            </p>
          </Card>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t bg-background/95 backdrop-blur">
        <div className="space-y-3">
          {canDismissWithoutMissions && (
            <Button 
              onClick={onDismiss} 
              className="w-full bg-gradient-primary hover:opacity-90"
              size="lg"
            >
              <X className="h-5 w-5 mr-2" />
              Dismiss Alarm
            </Button>
          )}
          
          {onSnooze && (
            <Button 
              onClick={onSnooze} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              Snooze (5 min)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};