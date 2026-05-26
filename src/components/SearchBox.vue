<template>
  <div class="relative w-full max-w-2xl mx-auto z-40">
    <!-- 搜索输入框容器 (新粗野主义大边框和强投影) -->
    <div class="flex items-stretch neo-border bg-white neo-shadow-sm focus-within:translate-x-[-2px] focus-within:translate-y-[-2px] focus-within:neo-shadow transition-all duration-100">
      <!-- 搜索 Icon -->
      <div class="flex items-center justify-center px-4 bg-lime-300 border-r-4 border-black font-black">
        🔍
      </div>
      <!-- 输入框 -->
      <input
        v-model="query"
        type="text"
        placeholder="输入城市名（如：朝阳区、杭州、nanjing）..."
        class="w-full py-4 px-4 text-lg font-bold placeholder-stone-500 focus:outline-none bg-transparent"
        @focus="isFocused = true"
        @blur="handleBlur"
        @keyup.enter="handleEnterFirst"
      />
      <!-- 清除按钮 -->
      <button 
        v-if="query" 
        class="px-4 hover:bg-rose-200 border-l-4 border-black text-black font-black transition-colors"
        @click="clearSearch"
      >
        ✕
      </button>
    </div>

    <!-- 搜索下拉提示列表 (新粗野主义高饱和列表框) -->
    <transition name="pop">
      <div 
        v-if="isFocused && (tips.length > 0 || isSearching)" 
        class="absolute left-0 right-0 mt-3 bg-white neo-border neo-shadow-sm max-h-80 overflow-y-auto z-50 no-scrollbar"
      >
        <div v-if="isSearching" class="p-4 text-center font-black text-stone-600 bg-amber-100 animate-pulse">
          正在搜寻城市坐标... 🛰️
        </div>
        <ul v-else class="divide-y-4 divide-black">
          <li 
            v-for="(tip, idx) in tips" 
            :key="idx"
            class="p-4 font-bold text-left cursor-pointer hover:bg-pink-300 hover:text-black transition-colors flex justify-between items-center"
            @mousedown="onSelectTip(tip)"
          >
            <div>
              <span class="text-xl font-black block">{{ tip.name }}</span>
              <span class="text-sm font-bold text-stone-600 block">{{ tip.district }}</span>
            </div>
            <div class="text-xs neo-border-sm bg-lime-200 px-2 py-1 font-black uppercase">
              {{ tip.province }}
            </div>
          </li>
        </ul>
      </div>
    </transition>

    <!-- 快速历史记录 (搜索栏下方的横向标签流) -->
    <div v-if="store.searchHistory.length > 0" class="flex flex-wrap gap-2 items-center mt-3 text-sm">
      <span class="font-black uppercase text-stone-600 mr-1">最近搜索:</span>
      <button 
        v-for="city in store.searchHistory" 
        :key="city.adcode"
        class="px-3 py-1 font-bold bg-white neo-border-sm neo-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:neo-shadow-sm active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all text-xs"
        @click="store.selectCity(city)"
      >
        {{ city.name }}
      </button>
      <button 
        class="text-xs font-black text-rose-500 hover:underline ml-auto"
        @click="store.clearHistory"
      >
        [清空历史]
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useWeatherStore } from '../store/weather';
import { searchCities, type CityTip } from '../utils/api';

const store = useWeatherStore();
const query = ref('');
const tips = ref<CityTip[]>([]);
const isSearching = ref(false);
const isFocused = ref(false);

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// 输入框防抖
watch(query, (newVal) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  
  const trimmed = newVal.trim();
  if (!trimmed) {
    tips.value = [];
    return;
  }

  isSearching.value = true;
  debounceTimer = setTimeout(async () => {
    try {
      tips.value = await searchCities(trimmed);
    } catch (e) {
      console.error(e);
    } finally {
      isSearching.value = false;
    }
  }, 400); // 400ms 防抖
});

// 选择提示项
const onSelectTip = (tip: CityTip) => {
  store.selectCity(tip);
  query.value = '';
  tips.value = [];
  isFocused.value = false;
};

// 回车默认选择第一条
const handleEnterFirst = () => {
  if (tips.value.length > 0) {
    onSelectTip(tips.value[0]);
  }
};

// 失去焦点延迟关闭下拉，以便触发 mousedown 事件
const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 200);
};

// 清除搜索内容
const clearSearch = () => {
  query.value = '';
  tips.value = [];
};
</script>

<style scoped>
.pop-enter-active,
.pop-leave-active {
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top;
}
.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scaleY(0.95);
}
</style>
