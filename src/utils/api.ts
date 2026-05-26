const AMAP_KEY = import.meta.env.VITE_AMAP_KEY || '';

export interface CityTip {
  adcode: string;
  name: string;      // 城市/地名
  district: string;  // 完整所属行政区，如 "北京市朝阳区"
  province: string;  // 省份
}

export interface LiveWeather {
  province: string;
  city: string;
  adcode: string;
  weather: string;
  temperature: string;
  winddirection: string;
  windpower: string;
  humidity: string;
  reporttime: string;
}

export interface ForecastCast {
  date: string;
  week: string;
  dayweather: string;
  nightweather: string;
  daytemp: string;
  nighttemp: string;
  daywind: string;
  nightwind: string;
  daypower: string;
  nightpower: string;
}

export interface ForecastWeather {
  province: string;
  city: string;
  adcode: string;
  reporttime: string;
  casts: ForecastCast[];
}

/**
 * 模糊城市搜索 (使用高德输入提示接口)
 */
export async function searchCities(keyword: string): Promise<CityTip[]> {
  if (!keyword.trim()) return [];
  if (!AMAP_KEY) {
    console.error('AMAP API Key is missing. Please set VITE_AMAP_KEY in .env file.');
    return [];
  }

  try {
    const url = `https://restapi.amap.com/v3/assistant/inputtips?key=${AMAP_KEY}&keywords=${encodeURIComponent(keyword)}&datatype=all`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '1' && Array.isArray(data.tips)) {
      // 过滤掉 adcode 为空，或者 adcode 为数组/非字符串的对象（高德有些空条目 adcode 会是个空数组）
      return data.tips
        .filter((tip: any) => tip.adcode && typeof tip.adcode === 'string' && tip.adcode.length > 0 && tip.name && typeof tip.name === 'string')
        .map((tip: any) => {
          let province = '';
          let district = '';

          // 尝试从 district 解析出省份
          if (typeof tip.district === 'string') {
            district = tip.district;
            const provMatch = tip.district.match(/^(.*?)(省|自治区|直辖市|特别行政区)/);
            if (provMatch) {
              province = provMatch[0];
            } else {
              // 兼容直辖市
              const cities = ['北京市', '上海市', '天津市', '重庆市'];
              for (const c of cities) {
                if (tip.district.startsWith(c)) {
                  province = c;
                  break;
                }
              }
            }
          }

          return {
            adcode: tip.adcode,
            name: tip.name,
            district: district || tip.name,
            province: province || district.split('市')[0] + '市' || ''
          };
        });
    }
    return [];
  } catch (error) {
    console.error('Failed to search cities:', error);
    return [];
  }
}

/**
 * 获取实时天气
 */
export async function getLiveWeather(adcode: string): Promise<LiveWeather | null> {
  if (!AMAP_KEY) return null;

  try {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${adcode}&extensions=base`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '1' && data.lives && data.lives.length > 0) {
      return data.lives[0] as LiveWeather;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch live weather:', error);
    return null;
  }
}

/**
 * 获取天气预报
 */
export async function getForecastWeather(adcode: string): Promise<ForecastWeather | null> {
  if (!AMAP_KEY) return null;

  try {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=${AMAP_KEY}&city=${adcode}&extensions=all`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === '1' && data.forecasts && data.forecasts.length > 0) {
      return data.forecasts[0] as ForecastWeather;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch forecast weather:', error);
    return null;
  }
}
