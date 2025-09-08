export interface MotivationalTrack {
  id: string;
  name: string;
  url: string;
  duration: number; // in seconds
  category: 'energetic' | 'peaceful' | 'inspirational' | 'nature' | 'custom';
  isPremium: boolean;
  description?: string;
}

export const defaultTracks: MotivationalTrack[] = [
  {
    id: '1',
    name: 'Rise & Shine',
    url: '/sounds/rise-and-shine.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: false,
    description: 'Upbeat motivational track to start your day'
  },
  {
    id: '2',
    name: 'Peaceful Dreams',
    url: '/sounds/peaceful-dreams.mp3',
    duration: 25,
    category: 'peaceful',
    isPremium: false,
    description: 'Gentle wake-up sound for bedtime reminders'
  },
  {
    id: '3',
    name: 'Zen Chimes',
    url: '/sounds/zen-chimes.mp3',
    duration: 20,
    category: 'peaceful',
    isPremium: false,
    description: 'Calming chimes for meditation alarms'
  },
  {
    id: '4',
    name: 'Victory March',
    url: '/sounds/victory-march.mp3',
    duration: 35,
    category: 'energetic',
    isPremium: true,
    description: 'Powerful orchestral track for champions'
  },
  {
    id: '5',
    name: 'Forest Awakening',
    url: '/sounds/forest-awakening.mp3',
    duration: 40,
    category: 'nature',
    isPremium: true,
    description: 'Natural sounds with birds and flowing water'
  },
  {
    id: '6',
    name: 'Success Anthem',
    url: '/sounds/success-anthem.mp3',
    duration: 45,
    category: 'inspirational',
    isPremium: true,
    description: 'Motivational speech with uplifting music'
  },
  {
    id: '7',
    name: 'Ocean Waves',
    url: '/sounds/ocean-waves.mp3',
    duration: 30,
    category: 'nature',
    isPremium: true,
    description: 'Gentle ocean sounds for peaceful awakening'
  },
  {
    id: '8',
    name: 'Champion Mindset',
    url: '/sounds/champion-mindset.mp3',
    duration: 38,
    category: 'inspirational',
    isPremium: true,
    description: 'Powerful affirmations with epic background music'
  }
];

export const getTracksByCategory = (category: MotivationalTrack['category']) => {
  return defaultTracks.filter(track => track.category === category);
};

export const getFreeTracksCount = () => {
  return defaultTracks.filter(track => !track.isPremium).length;
};

export const getPremiumTracksCount = () => {
  return defaultTracks.filter(track => track.isPremium).length;
};