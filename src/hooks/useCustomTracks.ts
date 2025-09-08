import { useState, useEffect } from 'react';
import { MotivationalTrack } from '@/data/motivationalTracks';

const CUSTOM_TRACKS_KEY = 'motivational_alarm_custom_tracks';

export const useCustomTracks = () => {
  const [customTracks, setCustomTracks] = useState<MotivationalTrack[]>([]);

  // Load custom tracks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CUSTOM_TRACKS_KEY);
    if (stored) {
      try {
        const tracks = JSON.parse(stored);
        setCustomTracks(tracks);
      } catch (error) {
        console.error('Failed to load custom tracks:', error);
        localStorage.removeItem(CUSTOM_TRACKS_KEY);
      }
    }
  }, []);

  // Save custom tracks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CUSTOM_TRACKS_KEY, JSON.stringify(customTracks));
  }, [customTracks]);

  const addCustomTrack = (track: MotivationalTrack) => {
    setCustomTracks(prev => [...prev, track]);
  };

  const deleteCustomTrack = (trackId: string) => {
    setCustomTracks(prev => {
      const filtered = prev.filter(track => track.id !== trackId);
      
      // Clean up object URLs to prevent memory leaks
      const deletedTrack = prev.find(track => track.id === trackId);
      if (deletedTrack && deletedTrack.url.startsWith('blob:')) {
        URL.revokeObjectURL(deletedTrack.url);
      }
      
      return filtered;
    });
  };

  const getTrackById = (trackId: string): MotivationalTrack | null => {
    return customTracks.find(track => track.id === trackId) || null;
  };

  const clearAllCustomTracks = () => {
    // Clean up all object URLs
    customTracks.forEach(track => {
      if (track.url.startsWith('blob:')) {
        URL.revokeObjectURL(track.url);
      }
    });
    
    setCustomTracks([]);
    localStorage.removeItem(CUSTOM_TRACKS_KEY);
  };

  return {
    customTracks,
    addCustomTrack,
    deleteCustomTrack,
    getTrackById,
    clearAllCustomTracks,
  };
};