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
  // Energetic & Motivational
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
    name: '6AM Rise and Shine',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/6AM%20RIse%20and%20Shine.mp3',
    duration: 29,
    category: 'energetic',
    isPremium: false,
    description: 'Early morning motivational wake-up call'
  },
  {
    id: '3',
    name: 'Good Morning Badass',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/good_morning_badass.mp3',
    duration: 16,
    category: 'energetic',
    isPremium: false,
    description: 'Powerful and confident morning wake-up call'
  },
  {
    id: '4',
    name: 'Wake Up Strong',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/wake-the-f-ck-up.mp3',
    duration: 9,
    category: 'energetic',
    isPremium: false,
    description: 'Direct and powerful wake-up call'
  },
  {
    id: '5',
    name: 'Do It!!!',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Do%20it!!!.mp3',
    duration: 20,
    category: 'energetic',
    isPremium: false,
    description: 'High-energy motivational push'
  },
  {
    id: '6',
    name: 'Doo It',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Doo%20It.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: false,
    description: 'Energetic motivation to take action'
  },
  {
    id: '7',
    name: 'Energy Work Hard',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Energy%20Work%20Hard.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: false,
    description: 'High-energy work motivation'
  },
  {
    id: '8',
    name: '10 Seconds to Get Up',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/10Sec%20to%20Get%20Up.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: false,
    description: 'Urgent countdown motivation'
  },
  // Premium Tracks (Additional tracks from GitHub repo)
  {
    id: '9',
    name: '3-2-1 Eagle Has Landed',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/3-2-1%20Eagle%20Has%20Landed.mp3',
    duration: 27,
    category: 'energetic',
    isPremium: true,
    description: 'Mission-style countdown motivation'
  },
  {
    id: '10',
    name: 'First Alarm Ring',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/First%20Alarm%20Ring.mp3',
    duration: 17,
    category: 'energetic',
    isPremium: true,
    description: 'Classic alarm motivation'
  },
  {
    id: '11',
    name: 'Good Morning Beautiful',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/good_morning_beautiful.mp3',
    duration: 20,
    category: 'peaceful',
    isPremium: true,
    description: 'Gentle and encouraging morning greeting'
  },
  {
    id: '12',
    name: 'Good Night Stane',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Good%20Night%20Stane.mp3',
    duration: 30,
    category: 'peaceful',
    isPremium: true,
    description: 'Calming bedtime reminder'
  },
  {
    id: '13',
    name: 'Take Your Meds',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/take_your_meds.mp3',
    duration: 30,
    category: 'peaceful',
    isPremium: true,
    description: 'Gentle reminder for medication'
  },
  {
    id: '14',
    name: 'Choose to Become Better',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Choose%20to%20Become%20Better.mp3',
    duration: 11,
    category: 'peaceful',
    isPremium: true,
    description: 'Gentle self-improvement motivation'
  },
  {
    id: '15',
    name: 'Get Up Gorgeous',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/get%20up%20Georgouse.mp3',
    duration: 21,
    category: 'inspirational',
    isPremium: true,
    description: 'Uplifting and confidence-boosting alarm'
  },
  {
    id: '16',
    name: 'Stunning Stack of Sunshine',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Stunning%20Stack%20of%20Sunshine.mp3',
    duration: 30,
    category: 'inspirational',
    isPremium: true,
    description: 'Bright and cheerful morning motivation'
  },
  {
    id: '17',
    name: 'Warrior of Faith',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Motivationsl%20Alarm%20clock%20Warrior%20of%20Faith.mp3',
    duration: 84,
    category: 'inspirational',
    isPremium: true,
    description: 'Powerful spiritual motivation for inner strength'
  },
  {
    id: '18',
    name: 'Believe in Yourself',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Beleive%20in%20YourSelf.mp3',
    duration: 30,
    category: 'inspirational',
    isPremium: true,
    description: 'Self-confidence and belief motivation'
  },
  {
    id: '19',
    name: 'Break the Pattern',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Break%20the%20Pattern.mp3',
    duration: 30,
    category: 'inspirational',
    isPremium: true,
    description: 'Motivation to change bad habits'
  },
  {
    id: '20',
    name: 'Day One',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Day%20One.mp3',
    duration: 29,
    category: 'inspirational',
    isPremium: true,
    description: 'Fresh start motivation'
  },
  {
    id: '21',
    name: 'Dare to Do',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Dare%20to%20Do.mp3',
    duration: 15,
    category: 'inspirational',
    isPremium: true,
    description: 'Courage and action motivation'
  },
  {
    id: '22',
    name: 'Dude You Have Another Day',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Dude%20You%20Have%20Another%20Day.mp3',
    duration: 13,
    category: 'inspirational',
    isPremium: true,
    description: 'Positive outlook on new opportunities'
  },
  {
    id: '23',
    name: 'Get Out of Bed',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Get%20out%20of%20Bed.mp3',
    duration: 24,
    category: 'inspirational',
    isPremium: true,
    description: 'Direct motivation to start the day'
  },
  {
    id: '24',
    name: 'Come On Man',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Comon%20Man.mp3',
    duration: 22,
    category: 'nature',
    isPremium: true,
    description: 'Friendly encouragement'
  },
  {
    id: '25',
    name: 'Don\'t Think About Going to Sleep',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Dont%20Think%20About%20going%20to%20sleep.mp3',
    duration: 15,
    category: 'nature',
    isPremium: true,
    description: 'Anti-snooze motivation'
  },
  {
    id: '26',
    name: 'Don\'t Matter You\'re a Marine',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Dont%20Matter%20Your%20a%20Marine.mp3',
    duration: 29,
    category: 'energetic',
    isPremium: true,
    description: 'Military-style motivational wake-up'
  },
  {
    id: '27',
    name: 'Football is Hard',
    url: 'https://raw.githubusercontent.com/NatronixM/Motivational-Alarm-Tracks-/main/Football%20is%20Hard.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: true,
    description: 'Sports motivation for toughness'
  },
  // Premium-Only Tracks for $4.99/month subscribers
  {
    id: '28',
    name: 'Elite Morning Warrior',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/elite_morning_warrior.mp3',
    duration: 45,
    category: 'energetic',
    isPremium: true,
    description: 'Exclusive high-energy military-style motivation for champions'
  },
  {
    id: '29',
    name: 'Unstoppable Force',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/unstoppable_force.mp3',
    duration: 38,
    category: 'energetic',
    isPremium: true,
    description: 'Premium power track for unstoppable mindset'
  },
  {
    id: '30',
    name: 'CEO Mindset Activation',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/ceo_mindset_activation.mp3',
    duration: 52,
    category: 'inspirational',
    isPremium: true,
    description: 'Executive-level motivation for business leaders'
  },
  {
    id: '31',
    name: 'Diamond Mind Protocol',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/diamond_mind_protocol.mp3',
    duration: 41,
    category: 'inspirational',
    isPremium: true,
    description: 'Premium mental clarity and focus activation'
  },
  {
    id: '32',
    name: 'Millionaire Morning Routine',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/millionaire_morning_routine.mp3',
    duration: 47,
    category: 'inspirational',
    isPremium: true,
    description: 'Success-oriented wealth mindset activation'
  },
  {
    id: '33',
    name: 'Alpha Peak Performance',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/alpha_peak_performance.mp3',
    duration: 39,
    category: 'energetic',
    isPremium: true,
    description: 'Premium peak performance state activation'
  },
  {
    id: '34',
    name: 'Zen Master Focus',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/zen_master_focus.mp3',
    duration: 43,
    category: 'peaceful',
    isPremium: true,
    description: 'Premium mindfulness and concentration enhancement'
  },
  {
    id: '35',
    name: 'Phoenix Rising Protocol',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/phoenix_rising_protocol.mp3',
    duration: 48,
    category: 'inspirational',
    isPremium: true,
    description: 'Transformation and rebirth motivation for life changes'
  },
  {
    id: '36',
    name: 'Quantum Leap Activation',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/quantum_leap_activation.mp3',
    duration: 44,
    category: 'inspirational',
    isPremium: true,
    description: 'Premium breakthrough mindset for major life upgrades'
  },
  {
    id: '37',
    name: 'Victory Visualization',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/victory_visualization.mp3',
    duration: 50,
    category: 'inspirational',
    isPremium: true,
    description: 'Premium success visualization and goal achievement'
  },
  {
    id: '38',
    name: 'Elite Athlete Mindset',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/elite_athlete_mindset.mp3',
    duration: 42,
    category: 'energetic',
    isPremium: true,
    description: 'Professional athlete-level mental conditioning'
  },
  {
    id: '39',
    name: 'Sacred Morning Ritual',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/sacred_morning_ritual.mp3',
    duration: 46,
    category: 'peaceful',
    isPremium: true,
    description: 'Premium spiritual awakening and inner power activation'
  },
  {
    id: '40',
    name: 'Limitless Potential Unlock',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/limitless_potential_unlock.mp3',
    duration: 49,
    category: 'inspirational',
    isPremium: true,
    description: 'Premium personal development and potential maximization'
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