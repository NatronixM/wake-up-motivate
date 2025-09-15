import { useState, useEffect } from 'react';

export const useAudioPlayer = () => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  const play = (url: string, volume: number = 0.8, loop: boolean = false) => {
    // Stop current audio if playing
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    const newAudio = new Audio(url);
    newAudio.volume = volume;
    newAudio.loop = loop; // Set loop property
    
    newAudio.onloadeddata = () => {
      newAudio.play().catch((error) => {
        console.error('Audio play failed:', error);
        setIsPlaying(false);
      });
    };

    newAudio.onplay = () => setIsPlaying(true);
    newAudio.onpause = () => setIsPlaying(false);
    newAudio.onended = () => {
      if (!loop) {
        setIsPlaying(false);
        setCurrentTrack(null);
      }
    };

    setAudio(newAudio);
    setCurrentTrack(url);
  };

  const stop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTrack(null);
    }
  };

  const setVolume = (volume: number) => {
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume));
    }
  };

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);

  return {
    play,
    stop,
    setVolume,
    isPlaying,
    currentTrack
  };
};