import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPermissionsGranted: () => void;
}

export const PermissionDialog = ({ 
  open, 
  onOpenChange, 
  onPermissionsGranted 
}: PermissionDialogProps) => {
  const [motionDetection, setMotionDetection] = useState(true);
  const [micAccess, setMicAccess] = useState(false);

  const handleStartAnalysis = () => {
    // In a real app, this would request actual permissions
    if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
      // Request microphone permission
      navigator.mediaDevices?.getUserMedia({ audio: true })
        .then(() => {
          console.log('Microphone permission granted');
          onPermissionsGranted();
          onOpenChange(false);
        })
        .catch((err) => {
          console.log('Microphone permission denied', err);
          // Still continue for demo purposes
          onPermissionsGranted();
          onOpenChange(false);
        });
    } else {
      // For demo purposes
      onPermissionsGranted();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-sm p-6">
        <div className="space-y-6">
          {/* Close Button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Illustration */}
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center">
              <div className="text-white text-6xl">😴</div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Mic access is needed to
            </h2>
            <h2 className="text-xl font-semibold text-foreground">
              measure your breath
            </h2>
          </div>

          {/* Permission Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="space-y-1">
                <div className="font-medium text-foreground">Detect motion</div>
                <div className="text-sm text-muted-foreground">
                  Measure device movement
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <Switch
                  checked={motionDetection}
                  onCheckedChange={setMotionDetection}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
              <div className="space-y-1">
                <div className="font-medium text-foreground">Mic access</div>
                <div className="text-sm text-muted-foreground">
                  Measure your breath during sleep
                </div>
              </div>
              <Switch
                checked={micAccess}
                onCheckedChange={setMicAccess}
              />
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              No worries, will be used only for sleep tracking!
            </p>
          </div>

          {/* Start Button */}
          <Button
            onClick={handleStartAnalysis}
            className="w-full bg-white text-black hover:bg-white/90 py-6 text-lg rounded-xl"
          >
            Start sleep analysis
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};