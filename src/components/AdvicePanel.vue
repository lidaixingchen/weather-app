<template>
  <div v-if="store.liveWeather" class="w-full text-left">
    <h2 class="text-2xl font-black mb-4 border-b-4 border-black pb-2 inline-block bg-lime-300 px-3 py-1 neo-border-sm neo-shadow-sm transform rotate-1">
      今日生存指南 🛡️
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="(item, idx) in advices" 
        :key="idx" 
        :class="[item.bg, 'neo-card neo-shadow-sm p-5 flex flex-col justify-between items-start']"
      >
        <div>
          <!-- 指南类型与图标 -->
          <div class="flex items-center gap-2 mb-3">
            <span class="text-xs font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 border border-black">
              {{ getTypeLabel(item.type) }}
            </span>
          </div>
          <!-- 建议标题 -->
          <h3 class="text-xl font-black text-black mb-2">{{ item.title }}</h3>
          <!-- 建议内容 -->
          <p class="text-sm font-bold text-stone-900 leading-relaxed">{{ item.content }}</p>
        </div>
        
        <!-- 卡片底部装饰标签 -->
        <span class="text-[9px] font-black uppercase text-stone-700 tracking-wider mt-4">
          ★ ADVICE // {{ item.type }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWeatherStore } from '../store/weather';
import { generateAdvice } from '../utils/advice';

const store = useWeatherStore();

const advices = computed(() => {
  if (!store.liveWeather) return [];
  const temp = parseInt(store.liveWeather.temperature) || 20;
  const weather = store.liveWeather.weather || '';
  return generateAdvice(temp, weather);
});

const getTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    wear: '穿衣装备',
    trip: '户外出行',
    sport: '运动洗车',
  };
  return labels[type] || '生活提示';
};
</script>

<style scoped>
</style>
