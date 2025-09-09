import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Scan } from "lucide-react";

interface BarcodeMissionProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export const BarcodeMission = ({ onComplete, isCompleted }: BarcodeMissionProps) => {
  const [scanningMode, setScanningMode] = useState(false);
  const [scanned, setScanned] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStartScan = () => {
    setScanningMode(true);
    fileInputRef.current?.click();
  };

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate barcode detection
      setScanned(true);
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  if (isCompleted) {
    return (
      <Card className="p-6 text-center bg-green-50 border-green-200">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800">Barcode Scanned! 📱</h3>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center">
      <div className="text-4xl mb-2">📱</div>
      <h3 className="text-lg font-semibold mb-4">Scan a Barcode</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Find and scan any barcode or QR code to dismiss the alarm
      </p>
      
      <div className="mb-6">
        <Scan className={`h-16 w-16 mx-auto text-muted-foreground mb-4 ${scanningMode ? 'animate-pulse' : ''}`} />
        {scanningMode && (
          <div className="text-sm text-blue-600">
            Looking for barcode...
          </div>
        )}
        {scanned && (
          <div className="text-sm text-green-600">
            Barcode detected! ✅
          </div>
        )}
      </div>
      
      <Button onClick={handleStartScan} disabled={scanningMode || scanned} className="w-full">
        <Scan className="h-4 w-4 mr-2" />
        {scanningMode ? 'Scanning...' : scanned ? 'Scanned!' : 'Start Scanning'}
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        style={{ display: 'none' }}
      />
    </Card>
  );
};