import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, Lock, Upload } from "lucide-react";
import { defaultTracks, MotivationalTrack } from "@/data/motivationalTracks";
import { CustomTrackUpload } from "./CustomTrackUpload";
import { cn } from "@/lib/utils";

interface TrackSelectorProps {
  selectedTrackId?: string;
  onTrackSelect: (track: MotivationalTrack) => void;
  showPremiumTracks?: boolean;
  customTracks?: MotivationalTrack[];
  onCustomTrackAdded?: (track: MotivationalTrack) => void;
  onCustomTrackDeleted?: (trackId: string) => void;
}

export const TrackSelector = ({ 
  selectedTrackId, 
  onTrackSelect, 
  showPremiumTracks = false,
  customTracks = [],
  onCustomTrackAdded,
  onCustomTrackDeleted
}: TrackSelectorProps) => {
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const handlePlayPreview = (track: MotivationalTrack) => {
    if (playingTrackId === track.id) {
      // Stop current track
      audioElement?.pause();
      setPlayingTrackId(null);
      setAudioElement(null);
    } else {
      // Stop any current audio
      audioElement?.pause();
      
      // Play new track
      const audio = new Audio(track.url);
      audio.currentTime = 0;
      audio.volume = 0.5;
      
      audio.onended = () => {
        setPlayingTrackId(null);
        setAudioElement(null);
      };
      
      audio.play().catch(() => {
        // Handle play error (fallback to selection without preview)
        onTrackSelect(track);
      });
      
      setPlayingTrackId(track.id);
      setAudioElement(audio);
    }
  };

  const categorizedTracks = {
    energetic: defaultTracks.filter(t => t.category === 'energetic'),
    peaceful: defaultTracks.filter(t => t.category === 'peaceful'),
    inspirational: defaultTracks.filter(t => t.category === 'inspirational'),
    nature: defaultTracks.filter(t => t.category === 'nature'),
  };

  const TrackCard = ({ track }: { track: MotivationalTrack }) => {
    const isSelected = selectedTrackId === track.id;
    const isPlaying = playingTrackId === track.id;
    const canAccess = !track.isPremium || showPremiumTracks;

    return (
      <Card 
        className={cn(
          "p-4 cursor-pointer border-border/50 transition-all duration-200",
          isSelected && "ring-2 ring-primary shadow-glow",
          !canAccess && "opacity-50"
        )}
        onClick={() => canAccess && onTrackSelect(track)}
      >
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              if (canAccess) handlePlayPreview(track);
            }}
            disabled={!canAccess}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground truncate">
                {track.name}
              </h4>
              {track.isPremium && <Lock className="h-3 w-3 text-muted-foreground" />}
            </div>
            {track.description && (
              <p className="text-xs text-muted-foreground truncate">
                {track.description}
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <Badge variant="secondary" className="text-xs">
              {track.duration}s
            </Badge>
            {track.isPremium && (
              <Badge variant="outline" className="text-xs border-primary/50">
                Pro
              </Badge>
            )}
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="energetic" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="energetic">Energy</TabsTrigger>
          <TabsTrigger value="peaceful">Peace</TabsTrigger>
          <TabsTrigger value="inspirational">Inspire</TabsTrigger>
          <TabsTrigger value="nature">Nature</TabsTrigger>
          <TabsTrigger value="custom">Custom</TabsTrigger>
        </TabsList>
        
        {Object.entries(categorizedTracks).map(([category, tracks]) => (
          <TabsContent key={category} value={category} className="space-y-3">
            {tracks.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </TabsContent>
        ))}
        
        {/* Custom Tracks Tab */}
        <TabsContent value="custom" className="space-y-3">
          {customTracks.length > 0 && (
            <div className="space-y-3">
              {customTracks.map((track) => (
                <TrackCard key={track.id} track={track} />
              ))}
            </div>
          )}
          
          {onCustomTrackAdded && onCustomTrackDeleted && (
            <CustomTrackUpload
              onTrackAdded={onCustomTrackAdded}
              customTracks={customTracks}
              onDeleteTrack={onCustomTrackDeleted}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};