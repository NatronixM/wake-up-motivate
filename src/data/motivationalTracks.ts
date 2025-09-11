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
  // Premium Tracks for $4.99/month subscribers - All tracks from Premium-Motivational-Tracks repository
  {
    id: '9',
    name: 'Legion of Voices Complaining',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Legion%20of%20Voices%20Complaining.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: true,
    description: 'Overcoming negative voices and self-doubt'
  },
  {
    id: '10',
    name: 'Lets Do it Tonight',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Lets%20Do%20it%20Tonight.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: true,
    description: 'Action-oriented motivation for immediate results'
  },
  {
    id: '11',
    name: 'Lets Go Champ',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Lets%20Go%20Champ.mp3',
    duration: 16,
    category: 'energetic',
    isPremium: true,
    description: 'Champion mindset activation'
  },
  {
    id: '12',
    name: 'Make Today Count 2',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Make%20Today%20Count%202.mp3',
    duration: 28,
    category: 'inspirational',
    isPremium: true,
    description: 'Advanced daily motivation for maximum impact'
  },
  {
    id: '13',
    name: 'Make Today Count',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Make%20Today%20Count.mp3',
    duration: 28,
    category: 'inspirational',
    isPremium: true,
    description: 'Daily motivation to maximize your potential'
  },
  {
    id: '14',
    name: 'Monster Dont Be Afraid',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Monster%20Dont%20Be%20Afraid.mp3',
    duration: 19,
    category: 'inspirational',
    isPremium: true,
    description: 'Courage and fearless mindset activation'
  },
  {
    id: '15',
    name: 'No More Sleep Get Up',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/No%20More%20Sleep%20Get%20Up.mp3',
    duration: 20,
    category: 'energetic',
    isPremium: true,
    description: 'Anti-procrastination wake-up call'
  },
  {
    id: '16',
    name: 'No One Will Outwork Me',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/No%20One%20will%20out%20work%20me.mp3',
    duration: 21,
    category: 'energetic',
    isPremium: true,
    description: 'Unmatched work ethic motivation'
  },
  {
    id: '17',
    name: 'On You What Do You Wanna Be',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/On%20You%20What%20do%20You%20Wanna%20Be.mp3',
    duration: 30,
    category: 'inspirational',
    isPremium: true,
    description: 'Identity and purpose clarification'
  },
  {
    id: '18',
    name: 'One Day or Day One',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/One%20Day%20or%20Day%20One.mp3',
    duration: 30,
    category: 'inspirational',
    isPremium: true,
    description: 'Stop procrastinating and start today'
  },
  {
    id: '19',
    name: 'Peaceful Going to Have a Good Day',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Peaceful%20Going%20to%20Have%20a%20Good%20Day.mp3',
    duration: 30,
    category: 'peaceful',
    isPremium: true,
    description: 'Gentle positive mindset for a great day'
  },
  {
    id: '20',
    name: 'Peaceful Hi',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Peaceful%20Hi.mp3',
    duration: 20,
    category: 'peaceful',
    isPremium: true,
    description: 'Calm and friendly morning greeting'
  },
  {
    id: '21',
    name: 'Peaceful Rough Life',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Peaceful%20Ruf%20Life.mp3',
    duration: 30,
    category: 'peaceful',
    isPremium: true,
    description: 'Finding peace through life challenges'
  },
  {
    id: '22',
    name: 'Ring Wakey Wakey!!!!!!',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Ring%20Wakey%20Wakey!!!!!!.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: true,
    description: 'High-energy wake-up call'
  },
  {
    id: '23',
    name: 'Rise and Remember Who You Are',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Rise%20and%20Remember%20Who%20You%20Are.mp3',
    duration: 23,
    category: 'inspirational',
    isPremium: true,
    description: 'Identity affirmation and self-worth'
  },
  {
    id: '24',
    name: 'Rise and Shine Premium',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Rise%20and%20Shine.mp3',
    duration: 15,
    category: 'energetic',
    isPremium: true,
    description: 'Premium version of the classic wake-up call'
  },
  {
    id: '25',
    name: 'Rise and Shine Big Dawg',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Rise%20in%20Shine%20Big%20Dawg.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: true,
    description: 'Confident and powerful morning motivation'
  },
  {
    id: '26',
    name: 'So Tired Wake Up',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Soo%20Tired%20Wake%20Up.mp3',
    duration: 28,
    category: 'energetic',
    isPremium: true,
    description: 'Motivation when feeling exhausted'
  },
  {
    id: '27',
    name: 'Stop Making Excuses',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Stop%20Making%20Excuses.mp3',
    duration: 15,
    category: 'inspirational',
    isPremium: true,
    description: 'Eliminate excuses and take action'
  },
  {
    id: '28',
    name: 'Stunning Stack of Sunshine',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Stunning%20Stack%20of%20Sunshine.mp3',
    duration: 13,
    category: 'inspirational',
    isPremium: true,
    description: 'Bright and uplifting compliment'
  },
  {
    id: '29',
    name: 'Thinking About Skipping the Gym',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Thinking%20about%20Skipping%20the%20Gym.mp3',
    duration: 22,
    category: 'energetic',
    isPremium: true,
    description: 'Fitness motivation to push through'
  },
  {
    id: '30',
    name: 'Time To Sleep and Recover',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Time%20To%20Sleep%20and%20Recover.mp3',
    duration: 30,
    category: 'peaceful',
    isPremium: true,
    description: 'Bedtime reminder for rest and recovery'
  },
  {
    id: '31',
    name: 'Too Early Too Cold Too Dark',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/To%20Early%20To%20Cold%20To%20Dark.mp3',
    duration: 30,
    category: 'inspirational',
    isPremium: true,
    description: 'Overcoming tough morning conditions'
  },
  {
    id: '32',
    name: 'Unstoppable Champion',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Unstoppable%20Champion.mp3',
    duration: 21,
    category: 'energetic',
    isPremium: true,
    description: 'Unstoppable winner mindset'
  },
  {
    id: '33',
    name: 'WTF You Expect',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/WTF%20You%20Expect.mp3',
    duration: 28,
    category: 'energetic',
    isPremium: true,
    description: 'Reality check motivation'
  },
  {
    id: '34',
    name: 'Wake Up Focus',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Wake%20Up%20Focus.mp3',
    duration: 21,
    category: 'energetic',
    isPremium: true,
    description: 'Mental clarity and focus activation'
  },
  {
    id: '37',
    name: 'Wake Up No Snooze',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Wake%20Up%20no%20Snooze.mp3',
    duration: 22,
    category: 'energetic',
    isPremium: true,
    description: 'Anti-snooze button motivation'
  },
  {
    id: '38',
    name: 'Wake Up!!! Get Up!!!!',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Wake%20Up!!!%20Get%20Up!!!!.mp3',
    duration: 14,
    category: 'energetic',
    isPremium: true,
    description: 'Urgent wake-up command'
  },
  {
    id: '39',
    name: 'Wake You Beautiful Bad Bitch',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Wake%20You%20Beatiful%20Bad%20Bitch%20.mp3',
    duration: 13,
    category: 'inspirational',
    isPremium: true,
    description: 'Confident and empowering wake-up'
  },
  {
    id: '40',
    name: 'Wake Up Lazy',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Wake%20up%20Lazy.mp3',
    duration: 25,
    category: 'energetic',
    isPremium: true,
    description: 'Motivation for lazy mornings'
  },
  {
    id: '41',
    name: 'Want the Gym',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Want%20the%20Gym.mp3',
    duration: 30,
    category: 'energetic',
    isPremium: true,
    description: 'Fitness motivation and gym dedication'
  },
  {
    id: '42',
    name: 'We Grind We Work Peaceful',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/We%20Grind%20We%20Work%20Peaceful.mp3',
    duration: 20,
    category: 'peaceful',
    isPremium: true,
    description: 'Calm but determined work ethic'
  },
  {
    id: '43',
    name: 'What Are You Doing!!!',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/What%20are%20You%20Doing!!!.mp3',
    duration: 14,
    category: 'energetic',
    isPremium: true,
    description: 'Reality check and action motivation'
  },
  {
    id: '44',
    name: 'What Do You Want to Be',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/What%20do%20You%20Want%20to%20Be.mp3',
    duration: 30,
    category: 'inspirational',
    isPremium: true,
    description: 'Life purpose and goal clarification'
  },
  {
    id: '45',
    name: 'Woo Hoo Your Alive',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Woo%20Hoo%20Your%20Alive.mp3',
    duration: 26,
    category: 'inspirational',
    isPremium: true,
    description: 'Celebration of life and vitality'
  },
  {
    id: '46',
    name: 'Yes Queen Slay',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/Yes%20Queen%20Slay.mp3',
    duration: 11,
    category: 'inspirational',
    isPremium: true,
    description: 'Empowering and confident affirmation'
  },
  {
    id: '47',
    name: 'You Got Stronger',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/You%20Got%20Stronger.mp3',
    duration: 22,
    category: 'inspirational',
    isPremium: true,
    description: 'Recognition of personal growth'
  },
  {
    id: '48',
    name: 'You Need to Make Progress',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/You%20Need%20to%20Make%20Progress.mp3',
    duration: 30,
    category: 'inspirational',
    isPremium: true,
    description: 'Progress-focused motivation'
  },
  {
    id: '49',
    name: 'You Silly MFER F Haters',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/You%20Silly%20MFER%20F%20Haters.mp3',
    duration: 28,
    category: 'energetic',
    isPremium: true,
    description: 'Confidence against negativity'
  },
  {
    id: '50',
    name: 'You Stunning Stack',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/You%20Stunning%20Stack.mp3',
    duration: 19,
    category: 'inspirational',
    isPremium: true,
    description: 'Confidence-boosting compliment'
  },
  {
    id: '51',
    name: 'You Are Ready Champion',
    url: 'https://raw.githubusercontent.com/NatronixM/Premium-Motivational-Tracks-/main/You%20are%20Ready%20Champion.mp3',
    duration: 25,
    category: 'inspirational',
    isPremium: true,
    description: 'Readiness and championship mindset'
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