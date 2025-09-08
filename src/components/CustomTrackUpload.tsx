import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Music, Trash2, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { MotivationalTrack } from "@/data/motivationalTracks";

interface CustomTrackUploadProps {
  onTrackAdded: (track: MotivationalTrack) => void;
  customTracks: MotivationalTrack[];
  onDeleteTrack: (trackId: string) => void;
}

export const CustomTrackUpload = ({ 
  onTrackAdded, 
  customTracks, 
  onDeleteTrack 
}: CustomTrackUploadProps) => {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [trackName, setTrackName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select an MP3, WAV, or OGG audio file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
    if (!trackName) {
      // Auto-fill track name from filename
      const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTrackName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !trackName.trim()) {
      toast.error("Please select a file and enter a track name");
      return;
    }

    setUploading(true);
    
    try {
      // Create object URL for preview (in a real app, this would upload to a server)
      const url = URL.createObjectURL(selectedFile);
      
      // Get audio duration
      const audio = new Audio(url);
      await new Promise((resolve, reject) => {
        audio.onloadedmetadata = resolve;
        audio.onerror = reject;
      });

      const newTrack: MotivationalTrack = {
        id: `custom_${Date.now()}`,
        name: trackName.trim(),
        url: url,
        duration: Math.round(audio.duration),
        category: 'custom',
        isPremium: false,
        description: 'Custom uploaded track'
      };

      onTrackAdded(newTrack);
      toast.success(`"${trackName}" uploaded successfully!`);
      
      // Reset form
      setTrackName("");
      setSelectedFile(null);
      setOpen(false);
      
    } catch (error) {
      toast.error("Failed to upload track. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handlePlayPreview = (track: MotivationalTrack) => {
    if (playingTrackId === track.id) {
      audioElement?.pause();
      setPlayingTrackId(null);
      setAudioElement(null);
    } else {
      audioElement?.pause();
      
      const audio = new Audio(track.url);
      audio.currentTime = 0;
      audio.volume = 0.5;
      
      audio.onended = () => {
        setPlayingTrackId(null);
        setAudioElement(null);
      };
      
      audio.play().catch(() => {
        toast.error("Could not play audio preview");
      });
      
      setPlayingTrackId(track.id);
      setAudioElement(audio);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-dashed border-primary/50 hover:border-primary">
            <Upload className="h-4 w-4 mr-2" />
            Upload Custom Track
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-card border-border/50">
          <DialogHeader>
            <DialogTitle>Upload Custom Alarm Track</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Audio File</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  className="flex-1"
                >
                  <Music className="h-4 w-4 mr-2" />
                  {selectedFile ? selectedFile.name : "Choose File"}
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept="audio/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {selectedFile && (
                <p className="text-xs text-muted-foreground">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
            
            {/* Track Name */}
            <div className="space-y-2">
              <Label htmlFor="track-name">Track Name</Label>
              <Input
                id="track-name"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                placeholder="My Motivational Track"
                className="bg-secondary/50 border-border/50"
              />
            </div>
            
            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !trackName.trim() || uploading}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              {uploading ? "Uploading..." : "Upload Track"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Custom Tracks List */}
      {customTracks.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Your Custom Tracks</Label>
          {customTracks.map((track) => (
            <Card key={track.id} className="p-3 border-border/50">
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => handlePlayPreview(track)}
                >
                  {playingTrackId === track.id ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {track.name}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {track.duration}s • Custom Track
                  </p>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  onClick={() => {
                    onDeleteTrack(track.id);
                    toast.success("Track deleted");
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};