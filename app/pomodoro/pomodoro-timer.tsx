"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Mode = "focus" | "short" | "long";

const MODES: Record<Mode, { label: string; bg: string; accent: string; message: string }> = {
  focus: {
    label: "專注",
    bg: "bg-[radial-gradient(circle_at_top,#b8382c_0%,#7a1f17_60%,#4a110c_100%)]",
    accent: "#ffb4a6",
    message: "專心做一件事，其他的等等再說",
  },
  short: {
    label: "短休息",
    bg: "bg-[radial-gradient(circle_at_top,#2f8f6a_0%,#175a42_60%,#0b3326_100%)]",
    accent: "#a6f0cf",
    message: "起來動一動、喝口水吧",
  },
  long: {
    label: "長休息",
    bg: "bg-[radial-gradient(circle_at_top,#2f6f9e_0%,#1a4566_60%,#0d2638_100%)]",
    accent: "#a6d4f0",
    message: "辛苦了！好好放鬆一下",
  },
};

// 每完成幾個蕃茄進入一次長休息
const LONG_BREAK_EVERY = 4;
const RING_RADIUS = 140;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState<Record<Mode, number>>({ focus: 25, short: 5, long: 15 });
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [task, setTask] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const endAtRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);

  const total = minutes[mode] * 60;
  const progress = total > 0 ? 1 - remaining / total : 0;
  const theme = MODES[mode];

  function switchMode(next: Mode, mins = minutes) {
    setRunning(false);
    setMode(next);
    setRemaining(mins[next] * 60);
  }

  function playChime() {
    const ctx = audioRef.current;
    if (!ctx) return;
    [0, 0.35, 0.7].forEach((delay) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.3);
    });
  }

  function start() {
    // 瀏覽器需要使用者操作後才能播放聲音，所以在按下開始時建立
    audioRef.current ??= new AudioContext();
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
    endAtRef.current = Date.now() + remaining * 1000;
    setRunning(true);
  }

  // 計時：用結束時間點計算剩餘秒數，分頁在背景也不會跑慢
  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left > 0) return;

      clearInterval(id);
      playChime();

      let next: Mode = "focus";
      if (mode === "focus") {
        const done = completed + 1;
        setCompleted(done);
        next = done % LONG_BREAK_EVERY === 0 ? "long" : "short";
      }
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        new Notification(mode === "focus" ? "🍅 專注結束！休息一下吧" : "⏰ 休息結束，繼續加油！");
      }
      switchMode(next);
    }, 250);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode, completed]);

  // 在瀏覽器分頁標題顯示倒數
  useEffect(() => {
    const original = document.title;
    document.title = `${formatTime(remaining)} ${theme.label} | 蕃茄鐘`;
    return () => {
      document.title = original;
    };
  }, [remaining, theme.label]);

  function updateMinutes(m: Mode, value: number) {
    const next = { ...minutes, [m]: Math.min(120, Math.max(1, value || 1)) };
    setMinutes(next);
    if (m === mode && !running) setRemaining(next[m] * 60);
  }

  const cycle = completed % LONG_BREAK_EVERY;

  return (
    <main
      className={`flex flex-1 flex-col items-center px-4 py-10 text-white transition-colors duration-700 ${theme.bg}`}
    >
      <Link href="/" className="mb-4 self-start text-sm text-white/60 hover:text-white">
        ← 回首頁
      </Link>
      <h1 className="mb-6 text-4xl font-black tracking-widest sm:text-5xl">🍅 蕃茄鐘</h1>

      {/* 模式切換 */}
      <div className="mb-8 flex gap-1 rounded-full bg-black/25 p-1">
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition ${
              m === mode ? "bg-white text-zinc-900 shadow" : "text-white/70 hover:text-white"
            }`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* 倒數圓環 */}
      <div className="relative aspect-square w-[min(340px,85vw)]">
        <svg viewBox="0 0 320 320" className="h-full w-full -rotate-90">
          <circle cx={160} cy={160} r={RING_RADIUS} fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.12)" strokeWidth={14} />
          <circle
            cx={160}
            cy={160}
            r={RING_RADIUS}
            fill="none"
            stroke={theme.accent}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={RING_LENGTH}
            strokeDashoffset={RING_LENGTH * (1 - progress)}
            className="transition-[stroke-dashoffset] duration-300 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-6xl font-bold tabular-nums sm:text-7xl">{formatTime(remaining)}</span>
          <span className="mt-2 text-sm text-white/70">{theme.message}</span>
        </div>
      </div>

      {/* 控制按鈕 */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={() => switchMode(mode)}
          className="rounded-full bg-white/15 px-5 py-3 text-sm font-bold hover:bg-white/25"
        >
          重設
        </button>
        <button
          onClick={running ? () => setRunning(false) : start}
          className="w-36 rounded-full bg-white py-4 text-xl font-black text-zinc-900 shadow-[0_6px_0_rgba(0,0,0,0.25)] transition active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.25)]"
        >
          {running ? "暫停" : remaining < total ? "繼續" : "開始"}
        </button>
        <button
          onClick={() => {
            // 跳過專注不計入完成數
            const next: Mode = mode === "focus" ? ((completed + 1) % LONG_BREAK_EVERY === 0 ? "long" : "short") : "focus";
            switchMode(next);
          }}
          className="rounded-full bg-white/15 px-5 py-3 text-sm font-bold hover:bg-white/25"
        >
          跳過
        </button>
      </div>

      {/* 目前任務 */}
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="現在要專注做什麼？"
        className="mt-10 w-full max-w-sm rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-center text-lg outline-none placeholder:text-white/40 focus:border-white/60"
      />

      {/* 今日進度 */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="flex gap-2 text-2xl">
          {Array.from({ length: LONG_BREAK_EVERY }, (_, i) => (
            <span key={i} className={i < cycle ? "" : "opacity-25 grayscale"}>
              🍅
            </span>
          ))}
        </div>
        <p className="text-sm text-white/70">
          已完成 <span className="text-lg font-bold text-white">{completed}</span> 個蕃茄・每 {LONG_BREAK_EVERY} 個長休息一次
        </p>
      </div>

      {/* 時間設定 */}
      <button
        onClick={() => setShowSettings((v) => !v)}
        className="mt-8 text-sm text-white/60 underline-offset-4 hover:text-white hover:underline"
      >
        ⚙️ {showSettings ? "收起設定" : "調整時間"}
      </button>
      {showSettings && (
        <div className="mt-4 flex gap-4 rounded-2xl bg-black/25 p-4">
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <label key={m} className="flex flex-col items-center gap-1 text-sm text-white/80">
              {MODES[m].label}
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={minutes[m]}
                  disabled={running}
                  onChange={(e) => updateMinutes(m, Number(e.target.value))}
                  className="w-16 rounded-lg bg-white/15 px-2 py-1 text-center text-white outline-none focus:bg-white/25 disabled:opacity-50"
                />
                分
              </div>
            </label>
          ))}
        </div>
      )}
    </main>
  );
}
