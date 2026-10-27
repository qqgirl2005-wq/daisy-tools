"use client";

import { useState } from "react";

// 深綠、淺綠交錯，名單為奇數時最後一格用第三色避免同色相鄰
const SLICE_COLORS = ["#17694a", "#2f9e6a"];
const SLICE_COLOR_ODD_LAST = "#228259";

const SIZE = 400;
const CENTER = SIZE / 2;
const RIM_RADIUS = 196;
const LIGHT_RADIUS = 184;
const SLICE_RADIUS = 168;
const LIGHT_COUNT = 18;
const SPIN_MS = 5000;

// 角度從正上方開始、順時針增加
function pointAt(deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: CENTER + r * Math.sin(rad), y: CENTER - r * Math.cos(rad) };
}

function slicePath(start: number, end: number) {
  const a = pointAt(start, SLICE_RADIUS);
  const b = pointAt(end, SLICE_RADIUS);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${a.x} ${a.y} A ${SLICE_RADIUS} ${SLICE_RADIUS} 0 ${largeArc} 1 ${b.x} ${b.y} Z`;
}

function sliceColor(i: number, total: number) {
  if (total % 2 === 1 && i === total - 1) return SLICE_COLOR_ODD_LAST;
  return SLICE_COLORS[i % 2];
}

function randomInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

function parseNames(text: string) {
  return text
    .split("\n")
    .map((name) => name.trim())
    .filter(Boolean);
}

export default function LuckyWheel() {
  const [input, setInput] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(true);

  const names = parseNames(input);
  const sliceDeg = names.length > 0 ? 360 / names.length : 360;
  const canSpin = !spinning && names.length >= 2;
  const maxLabel = names.length > 12 ? 4 : 6;
  const fontSize = names.length > 16 ? 11 : names.length > 10 ? 13 : 16;

  function spin() {
    if (!canSpin) return;

    const index = randomInt(names.length);
    const picked = names[index];
    // 在該扇形內隨機偏移，避免每次都停在正中間
    const offset = (randomInt(1000) / 1000 - 0.5) * sliceDeg * 0.7;
    const target = index * sliceDeg + sliceDeg / 2 + offset;
    // 讓目標扇形轉到正上方的指針位置
    const current = ((rotation % 360) + 360) % 360;
    const delta = (((360 - target - current) % 360) + 360) % 360;

    setWinner(null);
    setSpinning(true);
    setRotation(rotation + 360 * 6 + delta);

    setTimeout(() => {
      setSpinning(false);
      setWinner(picked);
      setHistory((prev) => [picked, ...prev]);
      if (removeWinner) {
        const rest = [...names];
        rest.splice(index, 1);
        setInput(rest.join("\n"));
      }
    }, SPIN_MS);
  }

  return (
    <>
      <p className="mb-8 rounded-full bg-black/25 px-5 py-1.5 text-sm text-emerald-100">
        名單共 <span className="mx-1 text-lg font-bold text-yellow-300">{names.length}</span> 人
        {names.length > 0 && names.length < 2 && "，至少需要 2 人才能抽獎"}
      </p>

      <div className="flex w-full max-w-5xl flex-col items-center gap-10 lg:flex-row lg:items-start lg:justify-center">
        {/* 轉盤 */}
        <div className="relative aspect-square w-[min(420px,90vw)] shrink-0">
          {/* 外框與跑馬燈（不轉） */}
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full drop-shadow-[0_0_30px_rgba(46,204,113,0.45)]">
            <defs>
              <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3fd17f" />
                <stop offset="100%" stopColor="#0f7a45" />
              </linearGradient>
            </defs>
            <circle cx={CENTER} cy={CENTER} r={RIM_RADIUS} fill="url(#rim)" />
            <circle cx={CENTER} cy={CENTER} r={SLICE_RADIUS + 4} fill="#0b4d2e" />
            {Array.from({ length: LIGHT_COUNT }, (_, i) => {
              const p = pointAt((360 / LIGHT_COUNT) * i, LIGHT_RADIUS);
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={5}
                  fill="#fffbe0"
                  className={spinning ? "animate-blink-fast" : "animate-blink"}
                  style={{
                    animationDelay: i % 2 ? (spinning ? "0.125s" : "0.5s") : "0s",
                    filter: "drop-shadow(0 0 4px #fff7a8)",
                  }}
                />
              );
            })}
          </svg>

          {/* 轉動的扇形 */}
          <svg
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="absolute inset-0 h-full w-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning
                ? `transform ${SPIN_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                : "none",
            }}
          >
            {names.length < 2 ? (
              <circle cx={CENTER} cy={CENTER} r={SLICE_RADIUS} fill={SLICE_COLORS[0]} />
            ) : (
              names.map((_, i) => (
                <path
                  key={i}
                  d={slicePath(i * sliceDeg, (i + 1) * sliceDeg)}
                  fill={sliceColor(i, names.length)}
                  stroke="#0b4d2e"
                  strokeWidth={2}
                />
              ))
            )}
            {names.map((name, i) => {
              const mid = i * sliceDeg + sliceDeg / 2;
              const pos = pointAt(mid, SLICE_RADIUS * 0.74);
              const label = name.length > maxLabel ? `${name.slice(0, maxLabel)}…` : name;
              return (
                <text
                  key={i}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#f0fff4"
                  fontSize={fontSize}
                  fontWeight={700}
                  transform={`rotate(${mid} ${pos.x} ${pos.y})`}
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.4)" }}
                >
                  {label}
                </text>
              );
            })}
          </svg>

          {/* 中央按鈕與指針（不轉） */}
          <div className="absolute left-1/2 top-1/2 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <svg
              viewBox="0 0 40 50"
              className="pointer-events-none absolute bottom-[78%] left-1/2 w-[42%] -translate-x-1/2 drop-shadow-[0_-2px_3px_rgba(0,0,0,0.3)]"
            >
              <path d="M20 0 L38 50 L2 50 Z" fill="#d7f56b" stroke="#8fbf1f" strokeWidth={2} />
            </svg>
            <button
              onClick={spin}
              disabled={!canSpin}
              className="relative h-full w-full rounded-full border-4 border-[#8fbf1f] bg-[radial-gradient(circle_at_35%_30%,#f4ffb0_0%,#c6ec4a_55%,#86b81c_100%)] text-lg font-black leading-tight text-[#2c5a10] shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_-4px_0_rgba(0,0,0,0.12)] transition active:scale-95 enabled:hover:brightness-110 disabled:cursor-not-allowed sm:text-xl"
            >
              {spinning ? (
                "抽獎中"
              ) : (
                <>
                  開始
                  <br />
                  抽獎
                </>
              )}
            </button>
          </div>
        </div>

        {/* 名單與紀錄 */}
        <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-emerald-400/20 bg-black/25 p-5 backdrop-blur">
          <label className="flex flex-col gap-2">
            <span className="font-bold text-emerald-200">抽獎名單</span>
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setWinner(null);
              }}
              disabled={spinning}
              rows={10}
              placeholder={"一行輸入一個名字，例如：\n小明\n小華\n小美"}
              className="rounded-lg border border-emerald-500/40 bg-emerald-950/60 p-3 text-emerald-50 outline-none placeholder:text-emerald-200/40 focus:border-yellow-300 disabled:opacity-60"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-emerald-100">
            <input
              type="checkbox"
              checked={removeWinner}
              onChange={(e) => setRemoveWinner(e.target.checked)}
              className="accent-yellow-300"
            />
            抽中後從名單移除（避免重複中獎）
          </label>

          {history.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-200">中獎紀錄</span>
                <button
                  onClick={() => setHistory([])}
                  className="text-sm text-emerald-300/70 hover:text-yellow-300"
                >
                  清除
                </button>
              </div>
              <ol className="flex flex-col gap-1 rounded-lg bg-emerald-950/60 p-3 text-sm text-emerald-50">
                {history.map((name, i) => (
                  <li key={i}>
                    <span className="text-yellow-300">第 {history.length - i} 位</span>　{name}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* 中獎彈窗 */}
      {winner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setWinner(null)}
        >
          <div
            className="animate-pop flex w-full max-w-xs flex-col items-center gap-3 rounded-3xl border-4 border-yellow-300 bg-gradient-to-b from-[#2f9e6a] to-[#0f5a36] px-6 py-8 text-center shadow-[0_0_40px_rgba(253,224,71,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-lg font-bold text-emerald-100">🎉 恭喜中獎 🎉</p>
            <p className="break-all text-4xl font-black text-yellow-300 [text-shadow:0_3px_0_#7a5a00]">
              {winner}
            </p>
            <button
              onClick={() => setWinner(null)}
              className="mt-3 rounded-full bg-yellow-300 px-8 py-2 font-bold text-[#5a3d00] hover:bg-yellow-200"
            >
              確定
            </button>
          </div>
        </div>
      )}
    </>
  );
}
