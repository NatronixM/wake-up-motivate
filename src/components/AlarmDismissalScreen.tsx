import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MathMission } from "./missions/MathMission";
import { MemoryGameMission } from "./missions/MemoryGameMission";
import { ShakeMission } from "./missions/ShakeMission";
import { PhotoMission } from "./missions/PhotoMission";
import { BarcodeMission } from "./missions/BarcodeMission";
import { AdBanner } from "./AdBanner";
import { AlarmClock, X } from "lucide-react";

interface AlarmDismissalScreenProps {
  alarmId: string;
  alarmLabel: string;
  alarmTime: string;
  missionEnabled: boolean;
  missionCount: number;
  snoozeEnabled: boolean;
  snoozeDuration: number;
  maxSnoozes: number;
  currentSnoozeCount: number;
  wakeUpCheckEnabled: boolean;
  wakeUpCheckType: 'math' | 'memory' | 'shake' | 'photo' | 'barcode';
  soundPowerUp: number;
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
  snoozeEnabled,
  snoozeDuration,
  maxSnoozes,
  currentSnoozeCount,
  wakeUpCheckEnabled,
  wakeUpCheckType,
  soundPowerUp,
  onDismiss,
  onSnooze
}: AlarmDismissalScreenProps) => {
  const [completedMissions, setCompletedMissions] = useState<number[]>([]);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [selectedMissions, setSelectedMissions] = useState<number[]>([]);
  const [wakeUpCheckCompleted, setWakeUpCheckCompleted] = useState(false);

  // Check if snooze is available
  const canSnooze = snoozeEnabled && onSnooze && (maxSnoozes === -1 || currentSnoozeCount < maxSnoozes);
  const snoozeText = maxSnoozes === -1 
    ? `Snooze (${snoozeDuration} min)` 
    : `Snooze (${snoozeDuration} min) - ${maxSnoozes - currentSnoozeCount} left`;

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
      // All missions completed, check if wake-up check is needed
      if (wakeUpCheckEnabled && !wakeUpCheckCompleted) {
        // Wake-up check will be handled by the component
        return;
      }
      // All requirements met
      setTimeout(() => onDismiss(), 1000);
    } else {
      // Move to next mission
      setCurrentMissionIndex(prev => prev + 1);
    }
  };

  const handleWakeUpCheckComplete = () => {
    setWakeUpCheckCompleted(true);
    // Check if all other requirements are met
    if (!missionEnabled || completedMissions.length >= selectedMissions.length) {
      setTimeout(() => onDismiss(), 1000);
    }
  };

  const canDismissWithoutMissions = (!missionEnabled || selectedMissions.length === 0) && 
                                   (!wakeUpCheckEnabled || wakeUpCheckCompleted);
  const progress = selectedMissions.length > 0 ? (completedMissions.length / selectedMissions.length) * 100 : 0;
  const allMissionsCompleted = selectedMissions.length > 0 && completedMissions.length >= selectedMissions.length;

  // Render wake-up check mission if needed
  const renderWakeUpCheck = () => {
    if (!wakeUpCheckEnabled || wakeUpCheckCompleted || (!allMissionsCompleted && missionEnabled)) return null;

    const WakeUpMissionComponent = missionTypes.find(m => 
      m.name.toLowerCase().includes(wakeUpCheckType) || 
      (wakeUpCheckType === 'math' && m.name.includes('Math')) ||
      (wakeUpCheckType === 'memory' && m.name.includes('Memory')) ||
      (wakeUpCheckType === 'shake' && m.name.includes('Shake')) ||
      (wakeUpCheckType === 'photo' && m.name.includes('Photo')) ||
      (wakeUpCheckType === 'barcode' && m.name.includes('Barcode'))
    )?.component || MathMission;

    return (
      <Card className="p-4 border-primary/50 bg-primary/5">
        <h3 className="text-lg font-semibold mb-3 text-center">Wake-up Check Required</h3>
        <WakeUpMissionComponent
          onComplete={handleWakeUpCheckComplete}
          isCompleted={false}
        />
      </Card>
    );
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Alarm Header */}
      <div className="bg-gradient-primary p-6 text-center text-white">
        <AlarmClock className="h-16 w-16 mx-auto mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold">{alarmTime}</h1>
        <p className="text-lg opacity-90">{alarmLabel}</p>
      </div>

      {/* Top Banner Ad */}
      <div className="px-4 pt-2">
        <AdBanner placement="top" />
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
            
            {/* Wake-up check after missions */}
            {allMissionsCompleted && renderWakeUpCheck()}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Wake-up check without missions */}
            {renderWakeUpCheck()}
            
            {!wakeUpCheckEnabled && (
              <Card className="p-8 text-center">
                <AlarmClock className="h-24 w-24 mx-auto mb-6 text-muted-foreground animate-pulse" />
                <h2 className="text-2xl font-bold mb-4">Good Morning! 🌅</h2>
                <p className="text-muted-foreground mb-6">
                  Time to rise and thrive! Your day starts now.
                </p>
              </Card>
            )}
          </div>
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
          
          {canSnooze && (
            <Button 
              onClick={onSnooze} 
              variant="outline" 
              className="w-full"
              size="lg"
            >
              {snoozeText}
            </Button>
          )}
        </div>
      </div>

      {/* Bottom Banner Ad */}
      <div className="px-4 pb-2">
        <AdBanner placement="bottom" />
      </div>
    </div>
  );
};