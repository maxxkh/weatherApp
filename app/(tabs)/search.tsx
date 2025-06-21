import { useState, useEffect } from 'react';
import { TextInput, ScrollView, TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import getWeatherIcon from '../../components/GetIcon'; // Assuming you have a utility function to map weather icons
interface WeatherData {
  city: {
    name: string;
    country: string;
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
}

interface ProcessedForecast {
  day: string;
  high: number;
  low: number;
  icon: keyof typeof Ionicons.glyphMap;
}

const API_KEY = '7074fb2f8b23cdaa52976bd1448b846b'
const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WeatherData | null>(null);
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

  const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

 

  const processForecastData = (data: WeatherData): ProcessedForecast[] => {
    const dailyData: Record<string, ProcessedForecast> = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      if (!dailyData[date]) {
        dailyData[date] = {
          day: date,
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          icon: getWeatherIcon(item.weather[0].icon)
        };
      } else {
        // Update highs and lows if needed
        dailyData[date].high = Math.max(dailyData[date].high, Math.round(item.main.temp_max));
        dailyData[date].low = Math.min(dailyData[date].low, Math.round(item.main.temp_min));
      }
    });
    
    return Object.values(dailyData).slice(0, 5);
  };

  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) return;
    
    setCity(searchQuery.trim());
  };

useEffect(() => {
  if (!city) return;

  const controller = new AbortController();
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, { signal: controller.signal });
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to fetch weather data');
        }
      } else {
        setError('An unknown error occurred');
      }
      setSearchResults(null);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  return () => controller.abort();
}, [city]);

  return (
    <View className="flex-1 bg-white px-5">
      {/* Search Header */}
      <View className="flex-row justify-between items-center py-4 mb-5">
        <Link href="../" asChild>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
        </Link>
        <Text className="text-xl font-semibold text-gray-800">Search City</Text>
        <View className="w-6" /> {/* Spacer for alignment */}
      </View>

      {/* Search Input */}
      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-5">
        <Ionicons name="search" size={20} color="#999" className="mr-3" />
        <TextInput
          className="flex-1 text-base text-gray-800"
          placeholder="Search for a city..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {loading && <ActivityIndicator size="large" color="#60B5FF" className="my-4" />}
      {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

      {searchResults ? (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-8 pb-5 border-b border-gray-200">
            <Text className="text-2xl font-medium text-gray-800">
              {searchResults.city.name}, {searchResults.city.country}
            </Text>
            
            {/* Current Weather */}
            {searchResults.list.length > 0 && (
              <>
                <View className="flex-row items-center justify-center my-4">
                  <Ionicons 
                    name={getWeatherIcon(searchResults.list[0].weather[0].icon)} 
                    size={80} 
                    color="#60B5FF" 
                  />
                  <Text className="text-5xl font-light text-gray-800 ml-2">
                    {Math.round(searchResults.list[0].main.temp)}°
                  </Text>
                </View>
                
                <Text className="text-xl text-gray-700 mb-6 capitalize">
                  {searchResults.list[0].weather[0].description}
                </Text>
                
                <View className="flex-row justify-around w-full">
                  <View className="items-center">
                    <Ionicons name="water-outline" size={20} color="#60B5FF" />
                    <Text className="text-gray-700 mt-1">{searchResults.list[0].main.humidity}%</Text>
                  </View>
                  <View className="items-center">
                    <Ionicons name="speedometer-outline" size={20} color="#60B5FF" />
                    <Text className="text-gray-700 mt-1">{Math.round(searchResults.list[0].wind.speed)} km/h</Text>
                  </View>
                  <View className="items-center">
                    <Ionicons name="thermometer-outline" size={20} color="#60B5FF" />
                    <Text className="text-gray-700 mt-1">Feels {Math.round(searchResults.list[0].main.feels_like)}°</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* 5-Day Forecast */}
          <Text className="text-lg font-semibold text-gray-600 mb-4">5-Day Forecast</Text>
          <View className="mb-8">
            {processForecastData(searchResults).map((day, index) => (
              <View 
                key={`${day.day}-${index}`} 
                className="flex-row items-center justify-between py-3 border-b border-gray-100"
              >
                <Text className="text-gray-700 w-12">{day.day}</Text>
                <Ionicons 
                  name={day.icon} 
                  size={30} 
                  color="#60B5FF" 
                  className="flex-1 pl-4"
                />
                <View className="flex-row items-center w-20 justify-end">
                  <Text className="text-gray-800 font-medium mr-3">{day.high}°</Text>
                  <Text className="text-gray-500">{day.low}°</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        !loading && (
          <View className="flex-1 justify-center items-center">
            <Ionicons name="search-outline" size={60} color="#ddd" />
            <Text className="text-gray-500 mt-4 text-lg">
              Search for a city to see weather
            </Text>
          </View>
        )
      )}
    </View>
  );
};

export default Search;