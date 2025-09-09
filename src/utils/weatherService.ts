export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  uvIndex: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
}

class WeatherService {
  private static readonly API_KEY = 'demo'; // In production, use a real API key
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';

  static async getCurrentLocation(): Promise<LocationData> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Unable to retrieve location'));
        }
      );
    });
  }

  static async getWeatherData(location: LocationData): Promise<WeatherData> {
    try {
      // For demo purposes, return mock data based on location
      // In production, replace with actual API call
      const mockData: WeatherData = {
        location: 'Current Location',
        temperature: Math.round(Math.random() * 30 + 10), // 10-40°C
        condition: this.getRandomCondition(),
        icon: this.getWeatherIcon(),
        humidity: Math.round(Math.random() * 50 + 30), // 30-80%
        windSpeed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
        feelsLike: Math.round(Math.random() * 30 + 10),
        uvIndex: Math.round(Math.random() * 10 + 1)
      };

      return mockData;
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  }

  private static getRandomCondition(): string {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Clear'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private static getWeatherIcon(): string {
    const icons = ['☀️', '⛅', '☁️', '🌧️', '🌤️'];
    return icons[Math.floor(Math.random() * icons.length)];
  }
}

export default WeatherService;