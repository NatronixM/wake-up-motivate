import { useState, useEffect } from 'react';
import HoroscopeService, { HoroscopeData, ZodiacSign } from '@/utils/horoscopeService';

export const useHoroscope = (birthDate?: Date) => {
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zodiacSign, setZodiacSign] = useState<ZodiacSign | null>(null);

  useEffect(() => {
    const fetchHoroscope = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get birth date from localStorage if not provided
        const storedBirthDate = localStorage.getItem('userBirthDate');
        let dateToUse = birthDate;
        
        if (!dateToUse && storedBirthDate) {
          dateToUse = new Date(storedBirthDate);
        }

        if (!dateToUse) {
          // Default to a random sign for demo
          const signs: ZodiacSign[] = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
          const randomSign = signs[Math.floor(Math.random() * signs.length)];
          setZodiacSign(randomSign);
          const horoscopeData = await HoroscopeService.getDailyHoroscope(randomSign);
          setHoroscope(horoscopeData);
          return;
        }

        const sign = HoroscopeService.getZodiacSign(dateToUse);
        setZodiacSign(sign);
        const horoscopeData = await HoroscopeService.getDailyHoroscope(sign);
        setHoroscope(horoscopeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch horoscope');
      } finally {
        setLoading(false);
      }
    };

    fetchHoroscope();
  }, [birthDate]);

  const setBirthDate = (date: Date) => {
    localStorage.setItem('userBirthDate', date.toISOString());
    const sign = HoroscopeService.getZodiacSign(date);
    setZodiacSign(sign);
    // Refetch horoscope with new sign
    HoroscopeService.getDailyHoroscope(sign).then(setHoroscope);
  };

  return { horoscope, zodiacSign, loading, error, setBirthDate };
};