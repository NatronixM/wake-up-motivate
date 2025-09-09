import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Camera } from "lucide-react";

interface PhotoMissionProps {
  onComplete: () => void;
  isCompleted: boolean;
}

export const PhotoMission = ({ onComplete, isCompleted }: PhotoMissionProps) => {
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTakePhoto = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
      setPhotoTaken(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  if (isCompleted) {
    return (
      <Card className="p-6 text-center bg-green-50 border-green-200">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800">Photo Mission Complete! 📷</h3>
        {photoUrl && (
          <div className="mt-4">
            <img 
              src={photoUrl} 
              alt="Mission photo" 
              className="w-32 h-32 object-cover rounded-lg mx-auto"
            />
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center">
      <div className="text-4xl mb-2">📷</div>
      <h3 className="text-lg font-semibold mb-4">Take a Photo</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Take a selfie or photo of your surroundings to dismiss the alarm
      </p>
      
      <div className="mb-6">
        <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
      </div>
      
      <Button onClick={handleTakePhoto} className="w-full">
        <Camera className="h-4 w-4 mr-2" />
        Take Photo
      </Button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoCapture}
        style={{ display: 'none' }}
      />
      
      {photoTaken && (
        <div className="mt-4">
          <p className="text-green-600 text-sm">Photo captured! ✅</p>
        </div>
      )}
    </Card>
  );
};