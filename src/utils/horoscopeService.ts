export interface HoroscopeData {
  sign: string;
  date: string;
  horoscope: string;
  luckyNumber: number;
  luckyColor: string;
  mood: string;
  compatibility: string;
}

export type ZodiacSign = 
  | 'aries' | 'taurus' | 'gemini' | 'cancer' 
  | 'leo' | 'virgo' | 'libra' | 'scorpio' 
  | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

class HoroscopeService {
  private static readonly SIGNS: { [key: string]: { name: string; dates: string } } = {
    aries: { name: 'Aries', dates: 'Mar 21 - Apr 19' },
    taurus: { name: 'Taurus', dates: 'Apr 20 - May 20' },
    gemini: { name: 'Gemini', dates: 'May 21 - Jun 20' },
    cancer: { name: 'Cancer', dates: 'Jun 21 - Jul 22' },
    leo: { name: 'Leo', dates: 'Jul 23 - Aug 22' },
    virgo: { name: 'Virgo', dates: 'Aug 23 - Sep 22' },
    libra: { name: 'Libra', dates: 'Sep 23 - Oct 22' },
    scorpio: { name: 'Scorpio', dates: 'Oct 23 - Nov 21' },
    sagittarius: { name: 'Sagittarius', dates: 'Nov 22 - Dec 21' },
    capricorn: { name: 'Capricorn', dates: 'Dec 22 - Jan 19' },
    aquarius: { name: 'Aquarius', dates: 'Jan 20 - Feb 18' },
    pisces: { name: 'Pisces', dates: 'Feb 19 - Mar 20' }
  };

  static getZodiacSign(birthDate: Date): ZodiacSign {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    return 'pisces';
  }

  static async getDailyHoroscope(sign: ZodiacSign): Promise<HoroscopeData> {
    try {
      // For demo purposes, return mock data
      // In production, integrate with actual horoscope API
      const horoscopes = [
        "Today brings new opportunities for growth and success. Trust your intuition and take calculated risks.",
        "Focus on relationships and communication today. A meaningful conversation could change your perspective.",
        "Your creativity is at its peak. Use this energy to tackle challenging projects and express yourself.",
        "Financial matters require attention. Review your budget and consider long-term investments.",
        "Health and wellness should be your priority. Take time for self-care and relaxation.",
        "Career opportunities may present themselves unexpectedly. Stay open to new possibilities.",
        "Family and home life bring joy and stability. Nurture your closest relationships."
      ];

      const colors = ['Red', 'Blue', 'Green', 'Purple', 'Gold', 'Silver', 'Orange'];
      const moods = ['Optimistic', 'Energetic', 'Calm', 'Confident', 'Creative', 'Peaceful', 'Ambitious'];
      const compatibility = ['Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius'];

      return {
        sign: this.SIGNS[sign].name,
        date: new Date().toDateString(),
        horoscope: horoscopes[Math.floor(Math.random() * horoscopes.length)],
        luckyNumber: Math.floor(Math.random() * 100) + 1,
        luckyColor: colors[Math.floor(Math.random() * colors.length)],
        mood: moods[Math.floor(Math.random() * moods.length)],
        compatibility: compatibility[Math.floor(Math.random() * compatibility.length)]
      };
    } catch (error) {
      throw new Error('Failed to fetch horoscope data');
    }
  }

  static getSignEmoji(sign: ZodiacSign): string {
    const emojis: { [key in ZodiacSign]: string } = {
      aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
      leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
      sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓'
    };
    return emojis[sign];
  }
}

export default HoroscopeService;