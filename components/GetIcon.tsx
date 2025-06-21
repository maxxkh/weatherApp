import { Ionicons } from '@expo/vector-icons';

export default  function GetIconName(weather: string | undefined): keyof typeof Ionicons.glyphMap {
    switch (weather?.toLowerCase()) {
      case 'clear':
        return 'sunny-outline';
      case 'clouds':
        return 'cloudy-outline';
      case 'rain':
        return 'rainy-outline';
      case 'thunderstorm':
        return 'thunderstorm-outline';
      case 'drizzle':
        return 'rainy-outline';
      case 'snow':
        return 'snow-outline';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'cloud-outline';
      default:
        return 'partly-sunny-outline';
    }
  }