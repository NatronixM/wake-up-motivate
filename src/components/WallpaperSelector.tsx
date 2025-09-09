import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Check } from "lucide-react";
import { toast } from "sonner";

interface Wallpaper {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  value: string;
  preview?: string;
}

const presetWallpapers: Wallpaper[] = [
  {
    id: 'sunrise',
    name: 'Sunrise',
    type: 'gradient',
    value: 'linear-gradient(135deg, #ff9a56 0%, #ff6b95 100%)',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    type: 'gradient', 
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    id: 'forest',
    name: 'Forest',
    type: 'gradient',
    value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  },
  {
    id: 'night',
    name: 'Night',
    type: 'gradient',
    value: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
  },
  {
    id: 'aurora',
    name: 'Aurora',
    type: 'gradient',
    value: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  },
  {
    id: 'desert',
    name: 'Desert',
    type: 'gradient',
    value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
];

interface WallpaperSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedWallpaper?: Wallpaper;
  onWallpaperSelect: (wallpaper: Wallpaper) => void;
  customWallpapers: Wallpaper[];
  onAddCustomWallpaper: (wallpaper: Wallpaper) => void;
}

export const WallpaperSelector: React.FC<WallpaperSelectorProps> = ({
  open,
  onOpenChange,
  selectedWallpaper,
  onWallpaperSelect,
  customWallpapers,
  onAddCustomWallpaper,
}) => {
  const [uploadingFile, setUploadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setUploadingFile(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const customWallpaper: Wallpaper = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        type: 'image',
        value: result,
        preview: result,
      };
      
      onAddCustomWallpaper(customWallpaper);
      onWallpaperSelect(customWallpaper);
      toast.success('Custom wallpaper added successfully!');
      setUploadingFile(false);
      onOpenChange(false);
    };

    reader.onerror = () => {
      toast.error('Failed to upload wallpaper');
      setUploadingFile(false);
    };

    reader.readAsDataURL(file);
  };

  const allWallpapers = [...presetWallpapers, ...customWallpapers];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border/50 max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose Alarm Wallpaper</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Upload Custom Wallpaper */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Custom Wallpaper</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFile}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadingFile ? 'Uploading...' : 'Upload Image'}
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload your own image (max 10MB). Supported formats: JPG, PNG, GIF, WebP
            </p>
          </div>

          {/* Wallpaper Grid */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Available Wallpapers</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allWallpapers.map((wallpaper) => (
                <Card
                  key={wallpaper.id}
                  className={`relative cursor-pointer border-2 transition-all hover:shadow-lg ${
                    selectedWallpaper?.id === wallpaper.id
                      ? 'border-primary shadow-primary/20'
                      : 'border-border/50 hover:border-border'
                  }`}
                  onClick={() => {
                    onWallpaperSelect(wallpaper);
                    onOpenChange(false);
                  }}
                >
                  <div className="aspect-video rounded-t-lg overflow-hidden">
                    {wallpaper.type === 'gradient' ? (
                      <div
                        className="w-full h-full"
                        style={{ background: wallpaper.value }}
                      />
                    ) : (
                      <img
                        src={wallpaper.preview || wallpaper.value}
                        alt={wallpaper.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {wallpaper.name}
                      </span>
                      {selectedWallpaper?.id === wallpaper.id && (
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};