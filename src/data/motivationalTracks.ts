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
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/rise_and_shine.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: false,
    description: 'Upbeat motivational track to start your day'
  },
  {
    id: '2',
    name: 'Good Morning Beautiful',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/good_morning_beautiful.mp3',
    duration: 25,
    category: 'peaceful',
    isPremium: false,
    description: 'Gentle and encouraging morning greeting'
  },
  {
    id: '3',
    name: 'Good Night Stane',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Good%20Night%20Stane.mp3',
    duration: 20,
    category: 'peaceful',
    isPremium: false,
    description: 'Calming bedtime reminder'
  },
  {
    id: '4',
    name: 'Good Morning Badass',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/good_morning_badass.mp3',
    duration: 35,
    category: 'energetic',
    isPremium: false,
    description: 'Powerful and confident morning wake-up call'
  },
  {
    id: '5',
    name: 'Get Up Gorgeous',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/get%20up%20Georgouse.mp3',
    duration: 30,
    category: 'inspirational',
    isPremium: false,
    description: 'Uplifting and confidence-boosting alarm'
  },
  {
    id: '6',
    name: 'Stunning Stack of Sunshine',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Stunning%20Stack%20of%20Sunshine.mp3',
    duration: 40,
    category: 'inspirational',
    isPremium: false,
    description: 'Bright and cheerful morning motivation'
  },
  {
    id: '7',
    name: 'Take Your Meds',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/take_your_meds.mp3',
    duration: 15,
    category: 'peaceful',
    isPremium: false,
    description: 'Gentle reminder for medication'
  },
  {
    id: '8',
    name: 'Wake Up Strong',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/wake-the-f-ck-up.mp3',
    duration: 20,
    category: 'energetic',
    isPremium: false,
    description: 'Direct and powerful wake-up call'
  },
  {
    id: '9',
    name: 'Warrior of Faith',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Motivationsl%20Alarm%20clock%20Warrior%20of%20Faith.mp3',
    duration: 45,
    category: 'inspirational',
    isPremium: false,
    description: 'Powerful spiritual motivation for inner strength'
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