import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, Activity, Volume2 } from "lucide-react";

interface SnoringData {
  duration: number;
  episodes: number;
  intensity: 'Low' | 'Medium' | 'High';
  avgDecibels: number;
  maxDecibels: number;
}

interface SnoringDetectorProps {
  onSnoringDetected?: (data: SnoringData) => void;
  isActive: boolean;
  onToggle: () => void;
}

export const SnoringDetector = ({ onSnoringDetected, isActive, onToggle }: SnoringDetectorProps) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const [snoringData, setSnoringData] = useState<SnoringData | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [snoringEpisodes, setSnoringEpisodes] = useState(0);
  const [maxDecibels, setMaxDecibels] = useState(0);
  const [avgDecibels, setAvgDecibels] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const decibelReadings = useRef<number[]>([]);
  const snoringThreshold = 50; // Decibel threshold for snoring detection
  const episodeThreshold = 30; // Consecutive readings above threshold to count as episode

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      analyserRef.current.fftSize = 256;
      microphoneRef.current.connect(analyserRef.current);
      
      setIsListening(true);
      analyzeAudio();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsListening(false);
    generateSnoringReport();
  };

  const analyzeAudio = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const processAudio = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate RMS (Root Mean Square) for volume level
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / bufferLength);
      const decibels = 20 * Math.log10(rms + 1);
      
      setAudioLevel(Math.min(decibels / 80 * 100, 100)); // Normalize to percentage
      decibelReadings.current.push(decibels);
      
      // Update max decibels
      if (decibels > maxDecibels) {
        setMaxDecibels(Math.round(decibels));
      }
      
      // Calculate rolling average
      const recentReadings = decibelReadings.current.slice(-60); // Last 60 readings
      const avg = recentReadings.reduce((a, b) => a + b, 0) / recentReadings.length;
      setAvgDecibels(Math.round(avg));
      
      // Detect snoring episodes (sustained high volume)
      const highVolumeCount = recentReadings.filter(reading => reading > snoringThreshold).length;
      if (highVolumeCount > episodeThreshold && recentReadings.length === 60) {
        setSnoringEpisodes(prev => prev + 1);
      }
      
      animationFrameRef.current = requestAnimationFrame(processAudio);
    };
    
    processAudio();
  };

  const generateSnoringReport = () => {
    if (decibelReadings.current.length === 0) return;
    
    const totalReadings = decibelReadings.current.length;
    const avgDb = decibelReadings.current.reduce((a, b) => a + b, 0) / totalReadings;
    const maxDb = Math.max(...decibelReadings.current);
    const snoringTime = decibelReadings.current.filter(reading => reading > snoringThreshold).length;
    const duration = (snoringTime / totalReadings) * 100; // Percentage of time snoring
    
    let intensity: 'Low' | 'Medium' | 'High' = 'Low';
    if (avgDb > 70) intensity = 'High';
    else if (avgDb > 55) intensity = 'Medium';
    
    const data: SnoringData = {
      duration,
      episodes: snoringEpisodes,
      intensity,
      avgDecibels: Math.round(avgDb),
      maxDecibels: Math.round(maxDb)
    };
    
    setSnoringData(data);
    onSnoringDetected?.(data);
    
    // Reset for next session
    decibelReadings.current = [];
    setSnoringEpisodes(0);
    setMaxDecibels(0);
    setAvgDecibels(0);
  };

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else if (isActive) {
      startListening();
    }
    onToggle();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      default: return 'text-green-500';
    }
  };

  return (
    <Card className="bg-gradient-card p-4 border-border/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Snoring Detection</h3>
          </div>
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={handleToggle}
            className="rounded-full"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        </div>

        {isListening && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Progress value={audioLevel} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground">{Math.round(audioLevel)}%</span>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="text-muted-foreground">Episodes</div>
                <div className="font-semibold text-foreground">{snoringEpisodes}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg dB</div>
                <div className="font-semibold text-foreground">{avgDecibels}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Max dB</div>
                <div className="font-semibold text-foreground">{maxDecibels}</div>
              </div>
            </div>
          </div>
        )}

        {snoringData && !isListening && (
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{snoringData.duration.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Time snoring</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-muted-foreground">Episodes</div>
                <div className="font-semibold text-foreground">{snoringData.episodes}</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">Intensity</div>
                <div className={`font-semibold ${getIntensityColor(snoringData.intensity)}`}>
                  {snoringData.intensity}
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Average: {snoringData.avgDecibels} dB</p>
              <p>• Peak: {snoringData.maxDecibels} dB</p>
              <p>• Episodes: {snoringData.episodes} detected</p>
            </div>
          </div>
        )}

        {!isActive && !isListening && (
          <div className="text-center text-sm text-muted-foreground">
            <p>Enable snoring detection to monitor your sleep audio</p>
          </div>
        )}
      </div>
    </Card>
  );
};