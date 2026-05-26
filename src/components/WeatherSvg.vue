<template>
  <div :style="{ width: size + 'px', height: size + 'px' }" class="flex items-center justify-center select-none">
    <!-- 1. 晴天 -->
    <svg v-if="weatherGroup === 'sunny'" viewBox="0 0 100 100" class="w-full h-full drop-shadow-md">
      <!-- 太阳光芒 (旋转) -->
      <g class="animate-spin-slow origin-center">
        <line x1="50" y1="10" x2="50" y2="22" stroke="#000" stroke-width="5" stroke-linecap="round" />
        <line x1="50" y1="78" x2="50" y2="90" stroke="#000" stroke-width="5" stroke-linecap="round" />
        <line x1="10" y1="50" x2="22" y2="50" stroke="#000" stroke-width="5" stroke-linecap="round" />
        <line x1="78" y1="50" x2="90" y2="50" stroke="#000" stroke-width="5" stroke-linecap="round" />
        
        <line x1="22" y1="22" x2="31" y2="31" stroke="#000" stroke-width="5" stroke-linecap="round" />
        <line x1="69" y1="69" x2="78" y2="78" stroke="#000" stroke-width="5" stroke-linecap="round" />
        <line x1="78" y1="22" x2="69" y2="31" stroke="#000" stroke-width="5" stroke-linecap="round" />
        <line x1="31" y1="69" x2="22" y2="78" stroke="#000" stroke-width="5" stroke-linecap="round" />
      </g>
      <!-- 太阳主体 -->
      <circle cx="50" cy="50" r="20" fill="#FF5C00" stroke="#000" stroke-width="5" />
      <circle cx="45" cy="45" r="5" fill="#FFE500" />
    </svg>

    <!-- 2. 下雨 -->
    <svg v-else-if="weatherGroup === 'rainy'" viewBox="0 0 100 100" class="w-full h-full">
      <!-- 雨云 -->
      <path d="M25,55 C25,40 38,32 45,35 C48,25 65,22 72,32 C80,32 88,40 85,55 C82,65 25,65 25,55 Z" fill="#6C72FF" stroke="#000" stroke-width="5" stroke-linejoin="round" />
      <!-- 雨滴 (浮动跳跃) -->
      <g>
        <path d="M35,70 L35,80" class="animate-rain-drop-1" stroke="#000" stroke-width="5" stroke-linecap="round" />
        <path d="M50,75 L50,85" class="animate-rain-drop-2" stroke="#000" stroke-width="5" stroke-linecap="round" />
        <path d="M65,70 L65,80" class="animate-rain-drop-3" stroke="#000" stroke-width="5" stroke-linecap="round" />
      </g>
    </svg>

    <!-- 3. 下雪 -->
    <svg v-else-if="weatherGroup === 'snowy'" viewBox="0 0 100 100" class="w-full h-full">
      <!-- 乌云 -->
      <path d="M25,55 C25,40 38,32 45,35 C48,25 65,22 72,32 C80,32 88,40 85,55 C82,65 25,65 25,55 Z" fill="#A8B4C4" stroke="#000" stroke-width="5" stroke-linejoin="round" />
      <!-- 雪花 (缩放闪烁) -->
      <g>
        <circle cx="35" cy="73" r="4" fill="#FFF" stroke="#000" stroke-width="2" class="animate-snow-flake-1" />
        <circle cx="50" cy="79" r="4" fill="#FFF" stroke="#000" stroke-width="2" class="animate-snow-flake-2" />
        <circle cx="65" cy="73" r="4" fill="#FFF" stroke="#000" stroke-width="2" class="animate-snow-flake-3" />
      </g>
    </svg>

    <!-- 4. 雷阵雨/雷雨 -->
    <svg v-else-if="weatherGroup === 'thunder'" viewBox="0 0 100 100" class="w-full h-full">
      <!-- 闪电 -->
      <polygon points="45,55 58,55 48,78 62,50 48,50 52,35" fill="#FFE500" stroke="#000" stroke-width="4" stroke-linejoin="round" class="animate-flash origin-center" />
      <!-- 乌云 -->
      <path d="M25,48 C25,33 38,25 45,28 C48,18 65,15 72,25 C80,25 88,33 85,48 C82,58 25,58 25,48 Z" fill="#3D405B" stroke="#000" stroke-width="5" stroke-linejoin="round" />
    </svg>

    <!-- 5. 阴天/多云 -->
    <svg v-else-if="weatherGroup === 'cloudy'" viewBox="0 0 100 100" class="w-full h-full">
      <!-- 背后小云 -->
      <path d="M40,45 C40,33 50,27 56,29 C59,20 73,18 79,26 C85,26 91,33 89,45 C86,53 40,53 40,45 Z" fill="#E2E8F0" stroke="#000" stroke-width="4" class="animate-drift-slow" />
      <!-- 前方大云 -->
      <path d="M15,60 C15,45 28,37 35,40 C38,30 55,27 62,37 C70,37 78,45 75,60 C72,70 15,70 15,60 Z" fill="#CBD5E1" stroke="#000" stroke-width="5" class="animate-drift-fast" />
    </svg>

    <!-- 6. 风/大风 -->
    <svg v-else-if="weatherGroup === 'windy'" viewBox="0 0 100 100" class="w-full h-full">
      <g class="stroke-black stroke-6 stroke-linecap-round fill-none">
        <path d="M20,30 Q45,20 60,30 T80,25 Q85,22 80,18 T70,25" class="animate-wind-1" />
        <path d="M15,50 Q35,45 50,55 T85,45" class="animate-wind-2" />
        <path d="M25,70 Q45,80 65,70 T75,75" class="animate-wind-3" />
      </g>
    </svg>

    <!-- 7. 其它 (沙尘/雾霾/未知) -->
    <svg v-else viewBox="0 0 100 100" class="w-full h-full">
      <circle cx="50" cy="50" r="30" fill="#E9C46A" stroke="#000" stroke-width="5" class="animate-pulse-slow" />
      <line x1="20" y1="42" x2="80" y2="42" stroke="#000" stroke-width="5" stroke-linecap="round" />
      <line x1="25" y1="52" x2="75" y2="52" stroke="#000" stroke-width="5" stroke-linecap="round" />
      <line x1="35" y1="62" x2="65" y2="62" stroke="#000" stroke-width="5" stroke-linecap="round" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    weather: string;
    size?: number;
  }>(),
  {
    size: 64
  }
);

const weatherGroup = computed(() => {
  const text = props.weather || '';
  if (text.includes('晴')) return 'sunny';
  if (text.includes('雷')) return 'thunder';
  if (text.includes('雨')) return 'rainy';
  if (text.includes('雪')) return 'snowy';
  if (text.includes('阴') || text.includes('多云')) return 'cloudy';
  if (text.includes('风')) return 'windy';
  return 'other';
});
</script>

<style scoped>
/* 慢速旋转 */
.animate-spin-slow {
  animation: spin 16s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 雨滴垂直弹跳 */
.animate-rain-drop-1 {
  animation: rain-fall 0.8s infinite linear;
}
.animate-rain-drop-2 {
  animation: rain-fall 0.8s infinite linear 0.25s;
}
.animate-rain-drop-3 {
  animation: rain-fall 0.8s infinite linear 0.5s;
}

@keyframes rain-fall {
  0% {
    transform: translateY(-8px);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  80% {
    transform: translateY(8px);
    opacity: 1;
  }
  100% {
    transform: translateY(12px);
    opacity: 0;
  }
}

/* 雪花闪烁跳动 */
.animate-snow-flake-1 {
  animation: snow-drift 1.4s infinite ease-in-out;
}
.animate-snow-flake-2 {
  animation: snow-drift 1.4s infinite ease-in-out 0.4s;
}
.animate-snow-flake-3 {
  animation: snow-drift 1.4s infinite ease-in-out 0.8s;
}

@keyframes snow-drift {
  0% {
    transform: translate(0, -6px) scale(0.6);
    opacity: 0;
  }
  50% {
    opacity: 1;
    transform: translate(3px, 3px) scale(1.1);
  }
  100% {
    transform: translate(-3px, 12px) scale(0.6);
    opacity: 0;
  }
}

/* 闪电频闪 */
.animate-flash {
  animation: lightning-flash 3s infinite ease;
}

@keyframes lightning-flash {
  0%, 90%, 94%, 98%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  92%, 96% {
    opacity: 0.1;
    transform: scale(0.9);
  }
}

/* 云朵轻微左右漂移 */
.animate-drift-slow {
  animation: cloud-drift-x 6s infinite ease-in-out;
}
.animate-drift-fast {
  animation: cloud-drift-x 4s infinite ease-in-out;
}

@keyframes cloud-drift-x {
  0%, 100% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(4px);
  }
}

/* 风线吹拂 */
.animate-wind-1 {
  animation: wind-blow-x 1.2s infinite ease-in-out;
}
.animate-wind-2 {
  animation: wind-blow-x 1.2s infinite ease-in-out 0.3s;
}
.animate-wind-3 {
  animation: wind-blow-x 1.2s infinite ease-in-out 0.6s;
}

@keyframes wind-blow-x {
  0% {
    stroke-dasharray: 0, 100;
    stroke-dashoffset: 0;
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    stroke-dasharray: 100, 0;
    stroke-dashoffset: -80;
    opacity: 0;
  }
}

/* 太阳或沙尘脉动 */
.animate-pulse-slow {
  animation: pulse-s 2.5s infinite ease-in-out;
}

@keyframes pulse-s {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}
</style>
