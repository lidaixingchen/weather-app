<template>
  <div class="w-full text-left">
    <h2 class="text-2xl font-black mb-4 border-b-4 border-black pb-2 inline-block bg-pink-300 px-3 py-1 neo-border-sm neo-shadow-sm transform -rotate-1">
      未来 4 天天气预报 📅
    </h2>

    <div v-if="store.forecastWeather && store.forecastWeather.casts" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
      <div 
        v-for="(cast, idx) in store.forecastWeather.casts" 
        :key="idx" 
        class="neo-card p-4 flex flex-col justify-between items-stretch hover:bg-stone-50 transition-colors"
      >
        <!-- 头部：日期 & 星期 -->
        <div class="border-b-2 border-black pb-2 mb-3">
          <div class="text-xs font-black text-stone-500 uppercase">{{ formatDate(cast.date) }}</div>
          <div class="text-lg font-black text-black">{{ getWeekText(cast.week, idx) }}</div>
        </div>

        <!-- 中部：SVG 图标 & 天气文字 -->
        <div class="flex flex-col items-center my-2 gap-2">
          <div class="border-2 border-black p-2 bg-amber-50 neo-shadow-sm">
            <WeatherSvg :weather="cast.dayweather" :size="48" />
          </div>
          <span class="font-black bg-black text-white px-2 py-0.5 text-xs inline-block">
            {{ cast.dayweather }}
          </span>
        </div>

        <!-- 尾部：温度范围 -->
        <div class="mt-4 pt-2 border-t-2 border-dashed border-stone-300 flex items-center justify-between">
          <div>
            <span class="text-2xl font-black text-black">{{ cast.daytemp }}°</span>
            <span class="text-sm font-bold text-stone-500 ml-1">/ {{ cast.nighttemp }}°</span>
          </div>
          <div class="text-right text-[10px] font-bold text-stone-500 leading-none">
            <span>{{ cast.daywind }}风</span><br />
            <span>{{ cast.daypower }}级</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else class="neo-card p-8 text-center font-bold text-stone-500 bg-white">
      暂无天气预报信息 📭
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWeatherStore } from '../store/weather';
import WeatherSvg from './WeatherSvg.vue';

const store = useWeatherStore();

// 格式化日期 "2026-05-27" -> "5月27日"
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    return `${parseInt(parts[1])}月${parseInt(parts[2])}日`;
  } catch (e) {
    return dateStr;
  }
};

// 星期文本转换，带上今天、明天前缀
const getWeekText = (weekCode: string, index: number) => {
  if (index === 0) return '今天';
  if (index === 1) return '明天';
  if (index === 2) return '后天';

  const weeks: Record<string, string> = {
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六',
    '7': '周日',
  };
  return weeks[weekCode] || `周${weekCode}`;
};
</script>

<style scoped>
</style>
