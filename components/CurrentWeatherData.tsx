import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { WeatherResponse } from '../interfaces/weatherApInterface';
import GetIconName from './GetIcon';


interface CurrentWeatherDataProps {
  weatherData: WeatherResponse | null;
  cityName: string;
  fetchData: () => void;  
}

const CurrentWeatherData: React.FC<CurrentWeatherDataProps> = ({ 
  weatherData, 
  cityName, 
  fetchData 
}) => {


  
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await fetchData();
    } finally {
      setLoading(false);
    }
  };




  return (
    <View>
      {/* Loading Overlay */}
      {loading && (
              <View className="absolute top-32 w-full h-[40vh] bg-[#60B5FF]  z-[100] justify-center items-center">
          <View className="bg-white p-6 rounded-xl items-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-3 text-gray-700">Loading weather data...</Text>
          </View>
        </View>

      )}

      <View className="flex-col justify-around items-center p-6 mt-14">
        {/* City and Refresh Button */}
        <View className="flex-row items-center justify-between space-x-2 w-full">
          <View className="flex-row items-center space-x-2">
            <Text className="text-white font-bold text-2xl ml-3">
              {weatherData?.name || cityName}
            </Text>
            <Ionicons name="location" size={20} color="white" />
          </View>
          <TouchableOpacity 
            onPress={handleRefresh} 
            className="ml-auto"
            disabled={loading}
          >
            <Ionicons 
              name="reload" 
              size={30} 
              color={loading ? "gray" : "white"} 
            />
          </TouchableOpacity>
        </View>

        {/* Temperature and Weather Description */}
        <View className="flex-row items-end space-x-2">
          <Text className="text-[100px] text-white">
            {weatherData?.main?.temp ? `${Math.round(weatherData.main.temp)}°` : '0.°'}
          </Text>
          <Text className="mb-7 text-xl text-white">
            {weatherData?.weather?.[0]?.main || 'Weather'}
          </Text>
          <Text className="mb-7 text-xl text-white">
            {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* Weather Icon */}
      <View className="items-center mb-20 -z-30">
        <View className="mb-8">
          <Ionicons
            name={GetIconName(weatherData?.weather?.[0]?.main)}
            size={150}
            color="white"
          />
        </View>
      </View>
      </View>
    </View>
  );
};

export default CurrentWeatherData;

const styles = StyleSheet.create({});