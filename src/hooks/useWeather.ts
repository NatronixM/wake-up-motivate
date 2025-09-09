import { useState, useEffect } from 'react';
import WeatherService, { WeatherData, LocationData } from '@/utils/weatherService';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const location = await WeatherService.getCurrentLocation();
        const weatherData = await WeatherService.getWeatherData(location);
        
        setWeather(weatherData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        // Fallback to default weather data
        setWeather({
          location: 'Unknown Location',
          temperature: 22,
          condition: 'Partly Cloudy',
          icon: '⛅',
          humidity: 65,
          windSpeed: 10,
          feelsLike: 24,
          uvIndex: 5
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return { weather, loading, error };
};