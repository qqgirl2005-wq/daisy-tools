"use client";

import { useState, useSyncExternalStore } from "react";

type Sign = {
  // 籤詩四句，每句四字，直式由右往左讀
  poem: [string, string, string, string];
  meaning: string;
};

type Level = {
  name: string;
  weight: number;
  color: string;
  // 各面向運勢的星數（1～5）
  stars: number;
  signs: Sign[];
};

// 權重越高越容易抽到，大吉、大凶比較稀有
const LEVELS: Level[] = [
  {
    name: "大吉",
    weight: 8,
    color: "#c0392b",
    stars: 5,
    signs: [
      { poem: ["紫氣東來", "福星高照", "心想事成", "步步登高"], meaning: "萬事順心，想做的事今天放膽去做吧！" },
      { poem: ["貴人相扶", "雲開月明", "所求皆得", "前程似錦"], meaning: "貴人就在身邊，開口請求會得到意想不到的幫助。" },
      { poem: ["春風得意", "花開滿園", "好運臨門", "喜上眉梢"], meaning: "好運滿滿，今天是實現願望的好日子。" },
    ],
  },
  {
    name: "中吉",
    weight: 14,
    color: "#cf5545",
    stars: 4,
    signs: [
      { poem: ["耕耘有時", "收穫在望", "莫問前程", "但行好事"], meaning: "努力會被看見，持續下去就有好結果。" },
      { poem: ["良朋相聚", "笑語盈門", "和氣生財", "情誼長存"], meaning: "人際關係和諧，適合與朋友聚會聊天。" },
      { poem: ["滴水穿石", "積少成多", "持之以恆", "終見成果"], meaning: "小小的堅持，會帶來大大的收穫。" },
    ],
  },
  {
    name: "小吉",
    weight: 18,
    color: "#d9725f",
    stars: 4,
    signs: [
      { poem: ["清風拂面", "細雨潤心", "平凡日子", "自有甘甜"], meaning: "平凡中藏著小確幸，留意身邊的美好。" },
      { poem: ["一步一印", "穩中求進", "不急不徐", "漸入佳境"], meaning: "按部就班，事情會慢慢上軌道。" },
      { poem: ["窗明几淨", "心境自寬", "除舊布新", "福氣自來"], meaning: "今天適合整理環境，好運會跟著進來。" },
    ],
  },
  {
    name: "吉",
    weight: 20,
    color: "#e08a86",
    stars: 3,
    signs: [
      { poem: ["平穩過關", "心安是福", "不求富貴", "日日開顏"], meaning: "平順的一天。不強求、不比較，維持現有步調就是最好的選擇。" },
      { poem: ["微笑迎人", "人亦笑迎", "和顏悅色", "好事自臨"], meaning: "保持微笑，好事自然會靠近。" },
      { poem: ["早睡早起", "飲食有節", "身安體健", "百事可成"], meaning: "多喝水、早點睡，就是最好的開運法。" },
    ],
  },
  {
    name: "末吉",
    weight: 18,
    color: "#b08d57",
    stars: 3,
    signs: [
      { poem: ["晨霧未散", "午後天晴", "先苦後甘", "漸見光明"], meaning: "先苦後甘，下午之後運勢漸漸好轉。" },
      { poem: ["三思後行", "莫急莫慌", "謀定而動", "自有方向"], meaning: "別急著下決定，多想一下會更好。" },
      { poem: ["花開有時", "不必心急", "靜待時機", "福自天來"], meaning: "好運還在路上，耐心等等它。" },
    ],
  },
  {
    name: "凶",
    weight: 14,
    color: "#6e6a78",
    stars: 2,
    signs: [
      { poem: ["禍從口出", "言多必失", "退一步想", "海闊天空"], meaning: "小心說話，避免無謂的爭執。" },
      { poem: ["出門細查", "慎防遺落", "小心謹慎", "可保平安"], meaning: "出門記得檢查東西有沒有帶齊。" },
      { poem: ["韜光養晦", "靜待時來", "保存氣力", "留予大事"], meaning: "今天低調一點，把力氣留給重要的事。" },
    ],
  },
  {
    name: "大凶",
    weight: 8,
    color: "#3a3744",
    stars: 1,
    signs: [
      { poem: ["風雨交加", "諸事不宜", "閉門休養", "以待天晴"], meaning: "諸事不宜，今天就好好休息吧。" },
      { poem: ["否極泰來", "谷底回升", "今日雖苦", "明日可期"], meaning: "運勢跌到谷底，接下來只會往上走！" },
      { poem: ["烏雲蔽日", "莫要灰心", "美食一頓", "煩惱全清"], meaning: "遇到不順別氣餒，吃點好吃的轉換心情。" },
    ],
  },
];

const ASPECTS = ["愛情", "事業", "財運", "健康"];
const LUCKY_COLORS = [
  { name: "正紅", hex: "#d4141c" },
  { name: "橘橙", hex: "#f08a24" },
  { name: "金黃", hex: "#e0a800" },
  { name: "草綠", hex: "#5aa83c" },
  { name: "天藍", hex: "#3f9bd8" },
  { name: "靛藍", hex: "#2e4a9e" },
  { name: "薰衣草紫", hex: "#9a7bc8" },
  { name: "櫻花粉", hex: "#f2a0b5" },
  { name: "米白", hex: "#f3ead8" },
  { name: "墨黑", hex: "#2a2a2a" },
];
const DIRECTIONS = ["東方", "西方", "南方", "北方", "東南", "東北", "西南", "西北"];
// 宜、忌從同一個清單抽，同一支籤不會重複出現
const ACTIVITIES = [
  "運動流汗",
  "整理房間",
  "請人吃飯",
  "簽下長期合約",
  "做重大決定",
  "向喜歡的人告白",
  "逛街購物",
  "短程旅行",
  "剪頭髮",
  "學習新技能",
  "跟朋友聚餐",
  "早點睡覺",
  "熬夜追劇",
  "加班趕工",
  "投資理財",
  "參加面試",
  "借錢給別人",
  "網購下單",
  "聯絡老朋友",
  "大掃除",
  "吃甜點",
  "開始減肥",
  "搬家換環境",
  "主動提出想法",
  "喝杯好咖啡",
  "打電動放鬆",
  "寫日記",
  "種植物",
  "拍照留念",
  "談判協商",
];
const SHAKE_MS = 1600;
const SERIF = '"Noto Serif TC", "Songti TC", "PMingLiU", "MingLiU", serif';

function randomInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function pick<T>(list: T[]) {
  return list[randomInt(list.length)];
}

function shuffle<T>(list: T[]) {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function pickLevel() {
  const total = LEVELS.reduce((sum, l) => sum + l.weight, 0);
  let r = randomInt(total);
  for (const level of LEVELS) {
    if (r < level.weight) return level;
    r -= level.weight;
  }
  return LEVELS[LEVELS.length - 1];
}

type Result = {
  level: Level;
  sign: Sign;
  number: number;
  aspects: { name: string; stars: number }[];
  luckyColor: (typeof LUCKY_COLORS)[number];
  luckyNumber: number;
  direction: string;
  helperHours: string;
  good: string[];
  bad: string[];
};

function drawFortune(): Result {
  const level = pickLevel();
  // 籤越好「宜」越多、籤越差「忌」越多，合計 5 項
  const goodCount = Math.min(3, Math.max(2, level.stars - 1));
  const activities = shuffle(ACTIVITIES);
  // 貴人時段：早上 7 點到晚上 9 點之間的兩小時
  const startHour = 7 + randomInt(13);
  return {
    level,
    sign: pick(level.signs),
    number: randomInt(100) + 1,
    // 各面向以籤的等級為基準，上下浮動一顆星
    aspects: ASPECTS.map((name) => ({
      name,
      stars: Math.min(5, Math.max(1, level.stars + randomInt(3) - 1)),
    })),
    luckyColor: pick(LUCKY_COLORS),
    luckyNumber: randomInt(99) + 1,
    direction: pick(DIRECTIONS),
    helperHours: `${String(startHour).padStart(2, "0")}:00 – ${String(startHour + 2).padStart(2, "0")}:00`,
    good: activities.slice(0, goodCount),
    bad: activities.slice(goodCount, 5),
  };
}

function Stars({ count }: { count: number }) {
  return (
    <span className="text-lg tracking-wider text-[#d9822b]">
      {"★".repeat(count)}
      <span className="text-[#d9822b]/20">{"★".repeat(5 - count)}</span>
    </span>
  );
}

function subscribeNoop() {
  return () => {};
}

function getToday() {
  return new Date().toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
}

function Divider() {
  return <hr className="w-full border-[#3a1a0a]/15" />;
}

export default function FortuneDraw() {
  const [shaking, setShaking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // 日期要在瀏覽器端讀取，建置時預先渲染不能用 new Date()
  const today = useSyncExternalStore(subscribeNoop, getToday, () => "");

  function draw() {
    if (shaking) return;
    setResult(null);
    setShaking(true);
    setTimeout(() => {
      const next = drawFortune();
      setShaking(false);
      setResult(next);
      setHistory((prev) => [next.level.name, ...prev].slice(0, 10));
    }, SHAKE_MS);
  }

  return (
    <>
      <p className="mb-10 rounded-full bg-black/25 px-5 py-1.5 text-sm text-amber-100">
        {today}・誠心默念想問的事，再搖籤筒
      </p>

      {/* 籤筒 */}
      <button
        onClick={draw}
        disabled={shaking}
        aria-label="搖籤筒"
        className="group relative flex flex-col items-center disabled:cursor-wait"
      >
        <div className={`relative ${shaking ? "animate-shake" : "transition group-hover:-rotate-3"}`}>
          {/* 籤枝 */}
          <div className="absolute -top-14 left-1/2 flex -translate-x-1/2 gap-1.5">
            {[-14, -6, 0, 6, 14].map((tilt, i) => (
              <div
                key={i}
                className="h-24 w-2.5 origin-bottom rounded-t-sm bg-gradient-to-b from-[#f5deb3] to-[#c9a46a]"
                style={{ transform: `rotate(${tilt}deg) translateY(${i % 2 ? 6 : 0}px)` }}
              >
                <div className="h-3 rounded-t-sm bg-[#d4141c]" />
              </div>
            ))}
          </div>
          {/* 筒身 */}
          <div className="relative flex h-48 w-36 flex-col items-center justify-center rounded-b-2xl rounded-t-md border-4 border-[#ffd76a] bg-gradient-to-b from-[#c8261c] to-[#7a110b] shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_-8px_0_rgba(0,0,0,0.2)]">
            <span className="text-4xl font-black leading-tight text-[#ffd76a] [writing-mode:vertical-rl] [text-shadow:0_2px_0_#7a3a00]">
              靈籤
            </span>
          </div>
        </div>
        <span className="mt-8 rounded-full bg-gradient-to-b from-[#ffe48a] to-[#e8a317] px-10 py-3 text-xl font-black text-[#5a2a00] shadow-[0_6px_0_#8a4d00] transition group-active:translate-y-1 group-active:shadow-[0_2px_0_#8a4d00] group-enabled:group-hover:brightness-110">
          {shaking ? "搖籤中…" : result ? "再抽一次" : "搖一搖抽籤"}
        </span>
      </button>

      {history.length > 0 && (
        <p className="mt-8 text-sm text-amber-100/70">
          最近抽到：{history.join("、")}
          <button onClick={() => setHistory([])} className="ml-3 hover:text-[#ffd76a]">
            清除
          </button>
        </p>
      )}

      {/* 籤詩 */}
      {result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setResult(null)}
        >
          <div
            className="animate-pop flex max-h-[92vh] w-full max-w-md flex-col items-center gap-5 overflow-y-auto rounded-lg bg-gradient-to-b from-[#faf4e8] to-[#ebdfca] px-6 py-8 text-[#3a1a0a] shadow-[0_0_40px_rgba(255,215,106,0.35)] sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm tracking-[0.4em] text-[#8a6a50]" style={{ fontFamily: SERIF }}>
              第 {result.number} 籤
            </p>
            <p
              className="-mt-2 text-8xl leading-none"
              style={{
                fontFamily: SERIF,
                color: result.level.color,
                textShadow: "0 4px 8px rgba(120,40,30,0.25)",
              }}
            >
              {result.level.name}
            </p>

            <Divider />

            {/* 籤詩直式：每句一欄由上往下，欄位由右往左排 */}
            <div className="flex flex-row-reverse gap-8 text-2xl leading-none" style={{ fontFamily: SERIF }}>
              {result.sign.poem.map((line) => (
                <p key={line} className="flex flex-col gap-2">
                  {[...line].map((char, i) => (
                    <span key={i}>{char}</span>
                  ))}
                </p>
              ))}
            </div>

            <Divider />

            <p className="w-full text-left leading-relaxed">
              <span className="mr-2 font-bold text-[#a8241c]" style={{ fontFamily: SERIF }}>
                解曰
              </span>
              {result.sign.meaning}
            </p>

            <Divider />

            <ul className="grid w-full grid-cols-2 gap-x-6 gap-y-2">
              {result.aspects.map((a) => (
                <li key={a.name} className="flex items-center justify-between">
                  <span className="font-bold">{a.name}</span>
                  <Stars count={a.stars} />
                </li>
              ))}
            </ul>

            <Divider />

            <dl className="grid w-full grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-[#8a6a50]">幸運色</dt>
                <dd className="flex items-center gap-2 font-bold">
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: result.luckyColor.hex }}
                  />
                  {result.luckyColor.name}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#8a6a50]">幸運數字</dt>
                <dd className="font-bold">{result.luckyNumber}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#8a6a50]">幸運方位</dt>
                <dd className="font-bold">{result.direction}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#8a6a50]">貴人時段</dt>
                <dd className="font-bold tabular-nums">{result.helperHours}</dd>
              </div>
            </dl>

            <Divider />

            <div className="grid w-full grid-cols-2 gap-x-6">
              {[
                { label: "宜", items: result.good, color: "#2e7d4a" },
                { label: "忌", items: result.bad, color: "#8a1c1c" },
              ].map(({ label, items, color }) => (
                <div key={label} className="flex flex-col items-start gap-2">
                  <span
                    className="rounded px-2 py-0.5 text-sm font-bold text-[#faf4e8]"
                    style={{ backgroundColor: color, fontFamily: SERIF }}
                  >
                    {label}
                  </span>
                  <ul className="flex flex-col gap-1">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <button
              onClick={() => setResult(null)}
              className="mt-2 rounded-full bg-[#a8241c] px-8 py-2 font-bold text-[#faf4e8] hover:bg-[#8a1c16]"
            >
              收下好運
            </button>
          </div>
        </div>
      )}
    </>
  );
}
