import { View, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { WeatherResponse } from '../../interfaces/weatherApInterface';
import CurrentWeatherdata from '../../components/CurrentWeatherData';
import ForecastWeather from '../../components/GetData';



export default function Home() {

  const API_KEY = '426aceb55eaa99c4ad90f5a907387587';
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [cityName, setCityName] = useState('khyber pakhtunkhwa');
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to fetch weather');
      }
      const data: WeatherResponse = await res.json();
      setWeatherData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setWeatherData(null);
      console.error('Weather fetch error:', err);
    }
  };
  useEffect(() => {
    fetchWeather(); 
  }
  , []);

  return (
    <ScrollView>
    <View className="bg-[#60B5FF] h-screen flex justify-between pb-10">
      <CurrentWeatherdata weatherData={weatherData} cityName={cityName} fetchData={fetchWeather}/>
      <ForecastWeather />
    </View>
    </ScrollView>
  );
}
