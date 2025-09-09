import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, Smartphone } from "lucide-react";

interface ShakeMissionProps {
  onComplete: () => void;
  isCompleted: boolean;
  targetShakes?: number;
}

export const ShakeMission = ({ onComplete, isCompleted, targetShakes = 10 }: ShakeMissionProps) => {
  const [shakeCount, setShakeCount] = useState(0);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (isCompleted) return;

    let lastX = 0, lastY = 0, lastZ = 0;
    let lastUpdate = 0;

    const handleDeviceMotion = (event: DeviceMotionEvent) => {
      if (!isListening) return;

      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const currentTime = new Date().getTime();
      if (currentTime - lastUpdate > 100) {
        const diffTime = currentTime - lastUpdate;
        lastUpdate = currentTime;

        const x = acceleration.x || 0;
        const y = acceleration.y || 0;
        const z = acceleration.z || 0;

        const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > 300) {
          setShakeCount(prev => {
            const newCount = prev + 1;
            if (newCount >= targetShakes) {
              setTimeout(() => onComplete(), 500);
            }
            return newCount;
          });
        }

        lastX = x;
        lastY = y;
        lastZ = z;
      }
    };

    if ('DeviceMotionEvent' in window) {
      // Request permission for iOS 13+
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        (DeviceMotionEvent as any).requestPermission()
          .then((response: string) => {
            if (response === 'granted') {
              setIsListening(true);
              window.addEventListener('devicemotion', handleDeviceMotion);
            }
          });
      } else {
        setIsListening(true);
        window.addEventListener('devicemotion', handleDeviceMotion);
      }
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [isCompleted, isListening, onComplete, targetShakes]);

  if (isCompleted) {
    return (
      <Card className="p-6 text-center bg-green-50 border-green-200">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800">Phone Shaking Complete! 📳</h3>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center">
      <div className="text-4xl mb-2">📳</div>
      <h3 className="text-lg font-semibold mb-4">Shake Your Phone</h3>
      <div className="mb-4">
        <Smartphone className={`h-16 w-16 mx-auto mb-4 ${shakeCount > 0 ? 'animate-bounce' : ''}`} />
        <div className="text-3xl font-bold text-primary">
          {shakeCount} / {targetShakes}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Shake your phone vigorously to dismiss the alarm!
        </p>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-3">
        <div 
          className="bg-primary h-3 rounded-full transition-all duration-300"
          style={{ width: `${(shakeCount / targetShakes) * 100}%` }}
        />
      </div>
    </Card>
  );
};