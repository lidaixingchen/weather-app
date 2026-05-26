<script setup lang="ts">
import { onMounted } from 'vue';
import { useWeatherStore } from './store/weather';
import SearchBox from './components/SearchBox.vue';
import WeatherCard from './components/WeatherCard.vue';
import ForecastGrid from './components/ForecastGrid.vue';
import AdvicePanel from './components/AdvicePanel.vue';
import PinnedCities from './components/PinnedCities.vue';

const store = useWeatherStore();

onMounted(() => {
  // 初始化加载 localStorage 和天气数据
  store.init();
});
</script>

<template>
  <div class="min-h-screen bg-stone-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between selection:bg-black selection:text-white">
    
    <!-- 头部与核心版面容器 -->
    <div class="max-w-6xl w-full mx-auto space-y-8 flex-1">
      
      <!-- HEADER: 帅气的新粗野主义标志标题 -->
      <header class="flex flex-col md:flex-row items-center justify-between gap-4 border-b-8 border-black pb-6">
        <div class="text-center md:text-left">
          <div class="inline-block bg-yellow-300 neo-border neo-shadow-sm px-4 py-2 transform -rotate-1">
            <h1 class="text-4xl sm:text-5xl font-black uppercase tracking-tight text-black">
              WEATHER DASH // 粗野天气
            </h1>
          </div>
          <p class="text-sm font-bold text-stone-700 mt-2 uppercase tracking-widest pl-1">
            ★ Powered by AMAP API & Vue3. Made in Neo-brutalism.
          </p>
        </div>
        
        <!-- API 状态卡片 -->
        <div class="neo-border-sm bg-lime-300 px-4 py-2 font-black text-sm neo-shadow-sm flex items-center gap-2">
          <span class="inline-block w-3 h-3 rounded-full bg-emerald-500 border border-black animate-ping"></span>
          <span>卫星网络链接: 正常</span>
        </div>
      </header>

      <!-- 搜索框 -->
      <section>
        <SearchBox />
      </section>

      <!-- 加载屏状态 (新粗野主义闪烁警报) -->
      <div v-if="store.isLoading" class="w-full neo-card neo-shadow p-12 text-center bg-amber-200">
        <div class="text-3xl font-black text-black animate-bounce mb-2">
          🛰️ CONNECTING SATELLITE...
        </div>
        <p class="text-lg font-black uppercase tracking-widest text-stone-700">
          正在获取实时气象回波与云图数据，请稍候
        </p>
      </div>

      <!-- 错误报错状态 -->
      <div v-else-if="store.errorMsg" class="w-full neo-card neo-shadow p-8 text-center bg-rose-300">
        <div class="text-4xl mb-4">⚠️</div>
        <h3 class="text-2xl font-black text-black mb-2">通信故障 (ERROR)</h3>
        <p class="text-lg font-bold text-stone-900 mb-6">{{ store.errorMsg }}</p>
        <button 
          class="neo-btn bg-white hover:bg-stone-100 px-6 py-3 text-lg font-black"
          @click="store.fetchWeatherData(store.currentCity.adcode)"
        >
          重新尝试建立连接 (RETRY)
        </button>
      </div>

      <!-- 核心天气板块 -->
      <main v-else class="space-y-8 animate-fade-in">
        <!-- 1. 实时天气看板 -->
        <section>
          <WeatherCard />
        </section>

        <!-- 2. 7天天气预报 & 指南建议 -->
        <div class="grid grid-cols-1 gap-8">
          <!-- 预报网格 -->
          <section>
            <ForecastGrid />
          </section>

          <!-- 指南建议 -->
          <section>
            <AdvicePanel />
          </section>
        </div>

        <!-- 3. 已收藏城市快捷面板 -->
        <section class="pt-4">
          <PinnedCities />
        </section>
      </main>

    </div>

    <!-- 底部页脚 -->
    <footer class="max-w-6xl w-full mx-auto mt-16 pt-6 border-t-4 border-black text-center text-xs font-black uppercase tracking-wider text-stone-500">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© 2026 WEATHER-DASH INC. ALL WEATHER TRACKED.</span>
        <span class="bg-black text-white px-2 py-0.5 border border-black">
          STATUS: BRUTALIST RUNNING
        </span>
      </div>
    </footer>

  </div>
</template>

<script lang="ts">
export default {
  name: 'App'
};
</script>

<style>
/* 简单的淡入动效 */
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
