export interface AdviceItem {
  type: 'wear' | 'trip' | 'sport';
  title: string;
  content: string;
  bg: string; // Tailwind bg-class for Neo-brutalism blocks
}

/**
 * 根据气温和天气现象生成新粗野主义生活建议
 * @param temp 实时温度数值
 * @param weatherText 天气现象描述 (例如: "晴", "小雨", "大风")
 */
export function generateAdvice(temp: number, weatherText: string): AdviceItem[] {
  const advices: AdviceItem[] = [];
  const text = weatherText || '';

  // 1. 穿衣建议
  let wearTitle = '穿衣指南';
  let wearContent = '温度适宜，随便穿穿，舒适就行。';
  let wearBg = 'bg-amber-300';

  if (temp < 0) {
    wearTitle = '急冻警告 🥶';
    wearContent = '急冻模式！羽绒服、厚围巾、秋裤全套防御装拉满，别在寒风里逞强。';
    wearBg = 'bg-blue-300';
  } else if (temp >= 0 && temp < 10) {
    wearTitle = '防寒警告 🧣';
    wearContent = '冻手冻脚。毛衣、呢大衣或防风外套出动，秋裤是时候套上了。';
    wearBg = 'bg-cyan-300';
  } else if (temp >= 10 && temp < 18) {
    wearTitle = '洋葱式叠穿 🧥';
    wearContent = '气温微凉。风衣、卫衣或夹克是完美选择，方便早晚御寒、中午脱衣。';
    wearBg = 'bg-indigo-300';
  } else if (temp >= 18 && temp < 26) {
    wearTitle = '潮流自如 👕';
    wearContent = '气温极度舒适！长袖 T 恤、单薄衬衫、牛仔裤，随便穿都好看。';
    wearBg = 'bg-lime-300';
  } else if (temp >= 26 && temp < 32) {
    wearTitle = '清爽上阵 🩳';
    wearContent = '短袖、短裤、连衣裙安排。出门记得防晒，多补充水分。';
    wearBg = 'bg-yellow-300';
  } else {
    wearTitle = '高温融化 🥵';
    wearContent = '融化警告！最薄的夏装上阵，物理防晒（太阳镜、防晒衣）拉满，别中暑。';
    wearBg = 'bg-rose-300';
  }
  advices.push({ type: 'wear', title: wearTitle, content: wearContent, bg: wearBg });

  // 2. 出行建议
  let tripTitle = '出行提示';
  let tripContent = '天公作美，宜出门游玩、会友或放空。';
  let tripBg = 'bg-pink-300';

  if (text.includes('雨')) {
    tripTitle = '带伞警告 ☔';
    tripContent = '自带 BGM！出门务必带伞，雨天路滑注意安全，千万别踩积水坑。';
    tripBg = 'bg-purple-300';
  } else if (text.includes('雪')) {
    tripTitle = '滑倒警告 ❄️';
    tripContent = '自带滤镜！景色虽美但路面易结冰，走路请双手别插兜，提防滑倒。';
    tripBg = 'bg-indigo-200';
  } else if (text.includes('风')) {
    tripTitle = '发型终结者 🌪️';
    tripContent = '妖风阵阵。出行提防高空坠物，戴好帽子，逆风前行要抓稳。';
    tripBg = 'bg-teal-300';
  } else if (text.includes('霾') || text.includes('尘') || text.includes('沙')) {
    tripTitle = '防御姿态 😷';
    tripContent = '空气拉警报！戴上口罩防PM2.5，关闭门窗，减少不必要的户外活动。';
    tripBg = 'bg-orange-300';
  } else if (temp >= 32) {
    tripTitle = '躲避太阳 ☀️';
    tripContent = '紫外线猛烈，尽可能呆在室内空调房。必须出门的话，请走阴凉处。';
    tripBg = 'bg-red-300';
  }
  advices.push({ type: 'trip', title: tripTitle, content: tripContent, bg: tripBg });

  // 3. 运动与洗车
  let sportTitle = '洗车运动';
  let sportContent = '适宜洗车和户外运动。出去跑两步，给身体充充电。';
  let sportBg = 'bg-emerald-300';

  if (text.includes('雨') || text.includes('雪')) {
    sportTitle = '别洗车！ 🚗';
    sportContent = '洗车等于求雨！今天洗车明天白洗。建议改在室内运动，练练拉伸。';
    sportBg = 'bg-stone-300';
  } else if (text.includes('霾') || text.includes('沙') || text.includes('尘')) {
    sportTitle = '室内修仙 🧘';
    sportContent = '禁止户外跑步！建议留在室内做瑜伽或打游戏，别让肺部当过滤器。';
    sportBg = 'bg-amber-400';
  } else if (temp > 35) {
    sportTitle = '拒绝暴晒 💦';
    sportContent = '太热了，去游泳池泡着吧，或者在空调房休息。户外激烈运动容易脱水。';
    sportBg = 'bg-rose-400';
  } else if (temp < 5) {
    sportTitle = '热身加倍 🏃';
    sportContent = '气温过低。如需户外运动请充分拉伸热身，防止肌肉拉伤，注意呼吸节奏。';
    sportBg = 'bg-violet-300';
  }
  advices.push({ type: 'sport', title: sportTitle, content: sportContent, bg: sportBg });

  return advices;
}
