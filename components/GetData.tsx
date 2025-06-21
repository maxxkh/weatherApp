import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { DailyForecast, ForecastItem } from '../interfaces/MianInterfaces';

const ForecastWeather = () => {


  const API_KEY = '426aceb55eaa99c4ad90f5a907387587';
  const [forecastData, setForecastData] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('khyber pakhtunkhwa');

  const fetchForecast = async (): Promise<DailyForecast[]> => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data');
      }
      const data = await response.json();
      // Group forecasts by day
      const forecastsByDay: {[key: string]: ForecastItem[]} = {};
      data.list.forEach((item: ForecastItem) => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        });
        
        if (!forecastsByDay[dateString]) {
          forecastsByDay[dateString] = [];
        }
        forecastsByDay[dateString].push(item);
      });

      // Process each day's forecasts
      const dailyForecasts: DailyForecast[] = Object.keys(forecastsByDay)
        .slice(0, 3) // Get only next 3 days
        .map(dateString => {
          const dayForecasts = forecastsByDay[dateString];
          const middayForecast = dayForecasts.find(f => {
            const hour = new Date(f.dt * 1000).getHours();
            return hour >= 11 && hour <= 13;
          }) || dayForecasts[Math.floor(dayForecasts.length / 2)];
          
          return {
            day: new Date(middayForecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
            date: dateString,
            temp: middayForecast.main.temp,
            temp_min: Math.min(...dayForecasts.map(f => f.main.temp_min)),
            temp_max: Math.max(...dayForecasts.map(f => f.main.temp_max)),
            humidity: middayForecast.main.humidity,
            weather: {
              main: middayForecast.weather[0].main,
              description: middayForecast.weather[0].description,
              icon: middayForecast.weather[0].icon,
            }
          };
        });

      setForecastData(dailyForecasts);
      return dailyForecasts;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error('Forecast fetch error:', err.message);
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, [city]);

  const getWeatherIcon = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case 'clear': return 'sunny';
      case 'clouds': return 'cloudy';
      case 'rain': return 'rainy';
      case 'snow': return 'snow';
      case 'thunderstorm': return 'thunderstorm';
      default: return 'partly-sunny';
    }
  };

  return (
  <View className=" p-6 bg-white">
    {/* Header with Search */}
    <View className="flex-row justify-between items-center mb-8">
      <View>
        <Text className="text-3xl font-bold text-gray-900">Forecast</Text>
        <Text className="text-lg text-blue-600">{city}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => fetchForecast()}
        className="bg-white p-3 rounded-full shadow-sm"
      >
        <Ionicons 
          name={loading ? "refresh-outline" : "refresh"} 
          size={20} 
          color={loading ? "#9ca3af" : "#3b82f6"} 
        />
      </TouchableOpacity>
    </View>

    {/* Loading State */}
    {loading && (
      <View className="flex-1  justify-center items-center z-20">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    )}

    {/* Error State */}
    {error && (
      <View className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
        <Text className="text-red-600 text-center">{error}</Text>
      </View>
    )}

    {/* Forecast Cards */}
    {forecastData.length > 0 ? (
      <View className="flex-row justify-between">
        {forecastData.map((day, index) => (
          <View 
            key={index}
            className="bg-white w-[30%] p-4 rounded-2xl shadow-sm items-center"
          >
            <Text className="text-gray-500 font-medium">{day.day}</Text>
            <Ionicons
              name={getWeatherIcon(day.weather.main)}
              size={36}
              color="#3b82f6"
              className="my-3"
            />
            <View className="flex-row items-end mb-2">
              <Text className="text-2xl font-bold text-gray-900">
                {Math.round(day.temp)}°
              </Text>
              <Text className="text-gray-400 text-sm ml-1">°C</Text>
            </View>
            
   
          </View>
        ))}
      </View>
    ) : (
      <View className="flex-1 justify-center items-center">
        <Ionicons name="cloud-offline-outline" size={48} color="#9ca3af" />
        <Text className="text-gray-400 mt-4">No forecast data</Text>
      </View>
    )}

    {/* Weather Details */}
    {forecastData.length > 0 && (
      <View className="mt-8 bg-white p-5 rounded-2xl shadow-sm">

        
        <Text className="text-center text-gray-500 capitalize">
          {forecastData[0].weather.description} throughout the day.
        </Text>
      </View>
    )}
  </View>
);
}

export default ForecastWeather;