<template>
  <div class="w-full text-left">
    <h2 class="text-2xl font-black mb-4 border-b-4 border-black pb-2 inline-block bg-teal-300 px-3 py-1 neo-border-sm neo-shadow-sm transform -rotate-1">
      已收藏城市 📌
    </h2>

    <div v-if="store.pinnedCities.length === 0" class="neo-card p-8 text-center font-bold text-stone-500 bg-white">
      目前没有收藏的城市。在上方搜索并点击 ♥ 即可加入这里！ 🌟
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="city in store.pinnedCities" 
        :key="city.adcode"
        :class="[
          store.currentCity.adcode === city.adcode ? 'bg-amber-100 translate-x-[-2px] translate-y-[-2px] neo-shadow' : 'bg-white',
          'neo-card-interactive p-4 flex items-center justify-between group'
        ]"
        @click="store.selectCity(city)"
      >
        <div class="flex-1 min-w-0 pr-2">
          <!-- 城市名字 -->
          <div class="flex items-center gap-2">
            <span class="text-xl font-black truncate block text-black">
              {{ city.name }}
            </span>
            <span 
              v-if="store.currentCity.adcode === city.adcode" 
              class="text-[9px] font-black uppercase bg-black text-white px-1 border border-black"
            >
              当前选中
            </span>
          </div>
          <span class="text-xs font-bold text-stone-500 truncate block mt-0.5">
            {{ city.district }}
          </span>
        </div>

        <!-- 实时温度预览 (如果有缓存的话) -->
        <div class="flex items-center gap-3">
          <div v-if="weatherCache[city.adcode]" class="text-right flex items-center gap-2 bg-stone-100 neo-border-sm px-2 py-1">
            <span class="text-sm font-black text-black">{{ weatherCache[city.adcode].temp }}°</span>
            <span class="text-xs font-bold bg-black text-white px-1 py-0.2">{{ weatherCache[city.adcode].text }}</span>
          </div>
          <div v-else class="w-12 h-6 bg-stone-100 animate-pulse border border-black border-dashed"></div>

          <!-- 取消收藏按钮 -->
          <button 
            class="text-stone-400 hover:text-rose-500 font-bold p-1 hover:scale-125 transition-transform"
            title="取消收藏"
            @click.stop="store.togglePin(city)"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useWeatherStore } from '../store/weather';
import { getLiveWeather } from '../utils/api';

const store = useWeatherStore();
const weatherCache = ref<Record<string, { temp: string; text: string }>>({});

// 拉取所有收藏城市的实时天气
const loadPinnedWeather = async () => {
  store.pinnedCities.forEach(async (city) => {
    // 避免重复获取
    if (weatherCache.value[city.adcode]) return;
    try {
      const live = await getLiveWeather(city.adcode);
      if (live) {
        weatherCache.value[city.adcode] = {
          temp: live.temperature,
          text: live.weather
        };
      }
    } catch (e) {
      console.error('Failed to pre-fetch pinned city weather', e);
    }
  });
};

// 监听收藏夹变化，随时更新
watch(
  () => store.pinnedCities,
  () => {
    loadPinnedWeather();
  },
  { deep: true }
);

onMounted(() => {
  loadPinnedWeather();
});
</script>

<style scoped>
</style>
