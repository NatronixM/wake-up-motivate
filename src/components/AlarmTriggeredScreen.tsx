import { useEffect, useState } from 'react';
import { AlarmDismissalScreen } from './AlarmDismissalScreen';
import { AlarmScheduler, Alarm } from '@/utils/alarmScheduler';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

interface AlarmTriggeredScreenProps {
  alarm: Alarm;
  onDismiss: () => void;
  onSnooze?: () => void;
}

export const AlarmTriggeredScreen = ({ 
  alarm, 
  onDismiss, 
  onSnooze 
}: AlarmTriggeredScreenProps) => {
  const [currentSnoozeCount, setCurrentSnoozeCount] = useState(alarm.currentSnoozeCount || 0);
  const { play, stop, isPlaying } = useAudioPlayer();

  useEffect(() => {
    // Start playing the alarm sound on loop
    if (alarm.soundName) {
      play(alarm.soundName, (alarm.volume || 80) / 100, true); // Enable looping
    }

    // Keep screen awake if supported
    if ('wakeLock' in navigator) {
      (navigator as any).wakeLock.request('screen').catch((err: any) => {
        console.log('Wake lock failed:', err);
      });
    }

    return () => {
      // Cleanup when component unmounts
      stop();
      AlarmScheduler.stopAlarmSound();
    };
  }, [alarm.soundName, alarm.volume, play, stop]);

  const handleDismiss = () => {
    stop();
    AlarmScheduler.stopAlarmSound();
    onDismiss();
  };

  const handleSnooze = () => {
    if (onSnooze) {
      stop();
      AlarmScheduler.stopAlarmSound();
      setCurrentSnoozeCount(prev => prev + 1);
      onSnooze();
    }
  };

  return (
    <AlarmDismissalScreen
      alarmId={alarm.id}
      alarmLabel={alarm.label || 'Wake Up!'}
      alarmTime={alarm.time}
      missionEnabled={alarm.missionEnabled || false}
      missionCount={alarm.missionCount || 1}
      snoozeEnabled={alarm.snoozeEnabled || true}
      snoozeDuration={alarm.snoozeDuration || 5}
      maxSnoozes={alarm.maxSnoozes || 3}
      currentSnoozeCount={currentSnoozeCount}
      wakeUpCheckEnabled={alarm.wakeUpCheckEnabled || false}
      wakeUpCheckType={alarm.wakeUpCheckType || 'math'}
      soundPowerUp={alarm.volume || 80}
      onDismiss={handleDismiss}
      onSnooze={alarm.snoozeEnabled ? handleSnooze : undefined}
    />
  );
};
