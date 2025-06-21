
export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  dt_txt: string;
}


export interface DailyForecast {
  day: string;
  date: string;
  temp: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  weather: {
    main: string;
    description: string;
    icon: string;
  };
}

