# 技术设计

## 技术栈

- **前端框架**：Vue 3 (Composition API, Setup 语法糖)
- **开发语言**：TypeScript
- **构建工具**：Vite 6
- **样式方案**：Tailwind CSS v4 (最新版 CSS 原生集成)
- **状态管理**：Pinia
- **工具库**：date-fns (用于日期格式化)
- **天气 API**：高德开放平台 Web 服务 API (输入提示 API & 天气查询 API)

## 项目结构

```text
weather-app/
├── src/
│   ├── assets/          # 静态资源、基础样式 (main.css)
│   ├── components/      # 组件
│   │   ├── SearchBox.vue       # 带模糊搜索下拉提示的输入框
│   │   ├── WeatherCard.vue     # 实时天气看板 (新粗野主义大卡片)
│   │   ├── ForecastGrid.vue    # 4天天气预报网格
│   │   ├── AdvicePanel.vue     # 个性化生活建议面板
│   │   ├── PinnedCities.vue    # 常用城市管理看板
│   │   └── WeatherSvg.vue      # 黑色粗描边动态气象 SVG 组件
│   ├── store/           # 状态管理
│   │   └── weather.ts   # 存储当前城市、收藏夹、搜索历史及天气缓存
│   ├── utils/           # 工具函数
│   │   ├── api.ts       # 封装高德 API 请求
│   │   └── advice.ts    # 生活指数建议生成算法
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── .env                 # 环境变量 (存储高德 API Key)
├── index.html
├── package.json
└── tsconfig.json
```

## 数据管理 (localStorage)

通过 Pinia 状态管理器同步本地存储。

### 1. `weather_pinned_cities`
- **说明**：用户收藏的常用城市列表。
- **结构**：
  ```typescript
  interface City {
    adcode: string;
    name: string;      // 城市/区县名，如 "朝阳区"
    district: string;  // 完整地名
    province: string;  // 省份
  }
  type PinnedCities = City[];
  ```

### 2. `weather_search_history`
- **说明**：最近 5 次的搜索历史。
- **结构**：`City[]`

### 3. `weather_last_city`
- **说明**：记录上一次浏览的城市，默认初始化时加载。
- **结构**：`City` (默认 "北京市 110000")

---

## 接口设计 (高德 API 封装)

前端通过 Vite 配置的代理或者直接请求高德 restapi 接口：

1. **输入提示接口 (Inputtips)**：
   - URL: `https://restapi.amap.com/v3/assistant/inputtips`
   - 参数：`key=${APIKEY}`, `keywords=${query}`
   - 过滤条件：仅提取响应中含有效 `adcode` 且 `address` 不为空的条目。

2. **天气查询接口 (WeatherInfo)**：
   - URL: `https://restapi.amap.com/v3/weather/weatherInfo`
   - 参数：`key=${APIKEY}`, `city=${adcode}`, `extensions=base` (获取实时天气)
   - 参数：`key=${APIKEY}`, `city=${adcode}`, `extensions=all` (获取未来 4 天天气预报)

