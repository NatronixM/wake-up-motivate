import { useState, useEffect } from 'react';

interface Wallpaper {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  value: string;
  preview?: string;
}

const CUSTOM_WALLPAPERS_KEY = 'motivational_alarm_custom_wallpapers';

export const useWallpapers = () => {
  const [customWallpapers, setCustomWallpapers] = useState<Wallpaper[]>([]);

  // Load custom wallpapers from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CUSTOM_WALLPAPERS_KEY);
    if (stored) {
      try {
        const wallpapers = JSON.parse(stored);
        setCustomWallpapers(wallpapers);
      } catch (error) {
        console.error('Failed to load custom wallpapers:', error);
        localStorage.removeItem(CUSTOM_WALLPAPERS_KEY);
      }
    }
  }, []);

  // Save custom wallpapers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(CUSTOM_WALLPAPERS_KEY, JSON.stringify(customWallpapers));
  }, [customWallpapers]);

  const addCustomWallpaper = (wallpaper: Wallpaper) => {
    setCustomWallpapers(prev => [...prev, wallpaper]);
  };

  const deleteCustomWallpaper = (wallpaperId: string) => {
    setCustomWallpapers(prev => {
      const filtered = prev.filter(wallpaper => wallpaper.id !== wallpaperId);
      
      // Clean up object URLs to prevent memory leaks
      const deletedWallpaper = prev.find(wallpaper => wallpaper.id === wallpaperId);
      if (deletedWallpaper && deletedWallpaper.value.startsWith('data:')) {
        // For data URLs, we don't need to revoke anything
        // For blob URLs, we would call URL.revokeObjectURL()
      }
      
      return filtered;
    });
  };

  const getWallpaperById = (wallpaperId: string): Wallpaper | null => {
    return customWallpapers.find(wallpaper => wallpaper.id === wallpaperId) || null;
  };

  const clearAllCustomWallpapers = () => {
    setCustomWallpapers([]);
    localStorage.removeItem(CUSTOM_WALLPAPERS_KEY);
  };

  return {
    customWallpapers,
    addCustomWallpaper,
    deleteCustomWallpaper,
    getWallpaperById,
    clearAllCustomWallpapers,
  };
};