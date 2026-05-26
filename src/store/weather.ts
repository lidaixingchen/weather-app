import { defineStore } from 'pinia';
import { getLiveWeather, getForecastWeather } from '../utils/api';
import type { LiveWeather, ForecastWeather, CityTip } from '../utils/api';

interface WeatherState {
  currentCity: CityTip;
  pinnedCities: CityTip[];
  searchHistory: CityTip[];
  liveWeather: LiveWeather | null;
  forecastWeather: ForecastWeather | null;
  isLoading: boolean;
  errorMsg: string;
}

const DEFAULT_CITY: CityTip = {
  adcode: '110000',
  name: '北京市',
  district: '北京市',
  province: '北京市'
};

export const useWeatherStore = defineStore('weather', {
  state: (): WeatherState => ({
    currentCity: DEFAULT_CITY,
    pinnedCities: [],
    searchHistory: [],
    liveWeather: null,
    forecastWeather: null,
    isLoading: false,
    errorMsg: ''
  }),

  getters: {
    isPinned: (state) => {
      return (adcode: string) => state.pinnedCities.some(city => city.adcode === adcode);
    }
  },

  actions: {
    /**
     * 初始化 store
     */
    async init() {
      // 1. 加载收藏城市列表
      try {
        const pinned = localStorage.getItem('weather_pinned_cities');
        this.pinnedCities = pinned ? JSON.parse(pinned) : [];
      } catch (e) {
        this.pinnedCities = [];
      }

      // 2. 加载搜索历史
      try {
        const history = localStorage.getItem('weather_search_history');
        this.searchHistory = history ? JSON.parse(history) : [];
      } catch (e) {
        this.searchHistory = [];
      }

      // 3. 加载最后查看城市
      try {
        const lastCity = localStorage.getItem('weather_last_city');
        this.currentCity = lastCity ? JSON.parse(lastCity) : DEFAULT_CITY;
      } catch (e) {
        this.currentCity = DEFAULT_CITY;
      }

      // 4. 获取初始化天气数据
      await this.fetchWeatherData(this.currentCity.adcode);
    },

    /**
     * 切换当前城市并获取天气
     */
    async selectCity(city: CityTip) {
      this.currentCity = city;
      localStorage.setItem('weather_last_city', JSON.stringify(city));
      
      // 添加到历史记录
      this.addToHistory(city);

      // 拉取新数据
      await this.fetchWeatherData(city.adcode);
    },

    /**
     * 获取指定城市的实时与预报天气
     */
    async fetchWeatherData(adcode: string) {
      this.isLoading = true;
      this.errorMsg = '';
      
      try {
        const [live, forecast] = await Promise.all([
          getLiveWeather(adcode),
          getForecastWeather(adcode)
        ]);

        if (live) {
          this.liveWeather = live;
        } else {
          this.errorMsg = '无法获取实时天气';
        }

        if (forecast) {
          this.forecastWeather = forecast;
        } else {
          // 如果预报缺失，暂时也置空，但不完全阻断
          this.forecastWeather = null;
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        this.errorMsg = '天气数据加载失败，请检查网络';
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 切换收藏状态
     */
    togglePin(city: CityTip) {
      const index = this.pinnedCities.findIndex(c => c.adcode === city.adcode);
      if (index > -1) {
        // 取消收藏
        this.pinnedCities.splice(index, 1);
      } else {
        // 收藏
        this.pinnedCities.push(city);
      }
      localStorage.setItem('weather_pinned_cities', JSON.stringify(this.pinnedCities));
    },

    /**
     * 添加至搜索历史
     */
    addToHistory(city: CityTip) {
      // 过滤掉重复项
      this.searchHistory = this.searchHistory.filter(c => c.adcode !== city.adcode);
      // 插入到最前面
      this.searchHistory.unshift(city);
      // 限制最多 5 个
      if (this.searchHistory.length > 5) {
        this.searchHistory = this.searchHistory.slice(0, 5);
      }
      localStorage.setItem('weather_search_history', JSON.stringify(this.searchHistory));
    },

    /**
     * 清空搜索历史
     */
    clearHistory() {
      this.searchHistory = [];
      localStorage.removeItem('weather_search_history');
    }
  }
});
