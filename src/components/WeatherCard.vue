<template>
  <div v-if="store.liveWeather" :class="[themeBg, 'w-full neo-card neo-shadow p-6 sm:p-8 relative overflow-hidden transition-colors duration-300']">
    <!-- 背景装饰网格线，增强新粗野主义几何设计感 -->
    <div class="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>

    <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
      
      <!-- 左侧：城市与大温度看板 -->
      <div class="flex-1 text-left">
        <!-- 城市全名与收藏按钮 -->
        <div class="flex items-center gap-3 mb-2 flex-wrap">
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-black flex items-center gap-2">
            {{ store.currentCity.name }}
          </h1>
          <span class="px-2 py-1 text-xs font-black uppercase neo-border-sm bg-black text-white">
            {{ store.currentCity.province }}
          </span>

          <!-- 收藏按钮 (新粗野主义按压式) -->
          <button 
            class="p-2 neo-border-sm neo-shadow-sm hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-none bg-white hover:bg-rose-100 transition-all cursor-pointer flex items-center justify-center rounded-none"
            :title="store.isPinned(store.currentCity.adcode) ? '取消收藏' : '收藏此城市'"
            @click="store.togglePin(store.currentCity)"
          >
            <span class="text-xl" :class="store.isPinned(store.currentCity.adcode) ? 'text-rose-500' : 'text-stone-400'">
              {{ store.isPinned(store.currentCity.adcode) ? '♥' : '♡' }}
            </span>
          </button>
        </div>

        <p class="text-sm font-bold text-stone-700 mb-6">
          行政编码: {{ store.currentCity.adcode }} | 更新时间: {{ formatTime(store.liveWeather.reporttime) }}
        </p>

        <!-- 超大实时温度与气象文本 -->
        <div class="flex items-baseline gap-2">
          <span class="text-7xl sm:text-8xl font-black tracking-tighter text-black">
            {{ store.liveWeather.temperature }}°C
          </span>
          <span class="text-2xl sm:text-3xl font-black border-4 border-black bg-white px-3 py-1 neo-shadow-sm transform -rotate-3 inline-block ml-2">
            {{ store.liveWeather.weather }}
          </span>
        </div>
      </div>

      <!-- 右侧：特大动态 SVG 图标 -->
      <div class="flex items-center justify-center md:justify-end px-4">
        <div class="border-4 border-black bg-white p-4 neo-shadow transform rotate-3 hover:rotate-0 transition-transform duration-200">
          <WeatherSvg :weather="store.liveWeather.weather" :size="160" />
        </div>
      </div>

    </div>

    <!-- 底部：三大天气指标网格 (新粗野主义撞色格子) -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t-4 border-black">
      
      <!-- 湿度 -->
      <div class="bg-white neo-border neo-shadow-sm p-4 text-left flex items-center justify-between">
        <div>
          <span class="text-xs font-black uppercase text-stone-500 block mb-1">空气湿度</span>
          <span class="text-2xl font-black text-black">{{ store.liveWeather.humidity }}%</span>
        </div>
        <div class="text-3xl">💧</div>
      </div>

      <!-- 风向 -->
      <div class="bg-white neo-border neo-shadow-sm p-4 text-left flex items-center justify-between">
        <div>
          <span class="text-xs font-black uppercase text-stone-500 block mb-1">当前风向</span>
          <span class="text-2xl font-black text-black">{{ store.liveWeather.winddirection }}风</span>
        </div>
        <div class="text-3xl">🧭</div>
      </div>

      <!-- 风力 -->
      <div class="bg-white neo-border neo-shadow-sm p-4 text-left flex items-center justify-between">
        <div>
          <span class="text-xs font-black uppercase text-stone-500 block mb-1">风力等级</span>
          <span class="text-2xl font-black text-black">{{ store.liveWeather.windpower }} 级</span>
        </div>
        <div class="text-3xl">🌬️</div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWeatherStore } from '../store/weather';
import WeatherSvg from './WeatherSvg.vue';

const store = useWeatherStore();

// 不同天气状况对应的背景色 (高饱和新粗野主义代表色)
const themeBg = computed(() => {
  if (!store.liveWeather) return 'bg-amber-100';
  const text = store.liveWeather.weather;
  if (text.includes('晴')) return 'bg-yellow-300';
  if (text.includes('雷')) return 'bg-indigo-300';
  if (text.includes('雨')) return 'bg-sky-400';
  if (text.includes('雪')) return 'bg-violet-300';
  if (text.includes('阴') || text.includes('多云')) return 'bg-emerald-300';
  if (text.includes('风')) return 'bg-teal-300';
  return 'bg-orange-300';
});

// 格式化更新时间
const formatTime = (timeStr: string) => {
  if (!timeStr) return '--:--';
  // 转换 "2026-05-27 00:00:00" 为 "00:00"
  try {
    return timeStr.split(' ')[1].slice(0, 5);
  } catch (e) {
    return timeStr;
  }
};
</script>

<style scoped>
/* 几何网格装饰背景 */
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, #000 1px, transparent 1px),
    linear-gradient(to bottom, #000 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
