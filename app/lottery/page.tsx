import type { Metadata } from "next";
import Link from "next/link";
import LuckyWheel from "./lucky-wheel";

export const metadata: Metadata = {
  title: "幸運大轉盤 | Daisy Tools",
  description: "輸入名單，轉動轉盤抽出幸運兒",
};

export default function LotteryPage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-[radial-gradient(circle_at_top,#1f5a3d_0%,#0c2a1c_55%,#071a11_100%)] px-4 py-10 text-white">
      <Link href="/" className="mb-4 self-start text-sm text-emerald-200/70 hover:text-white">
        ← 回首頁
      </Link>
      <h1 className="mb-2 text-5xl font-black tracking-widest text-[#5ef08c] [text-shadow:0_4px_0_#0b4d2a,0_0_24px_rgba(94,240,140,0.6)] sm:text-6xl">
        幸運大轉盤
      </h1>
      <LuckyWheel />
    </main>
  );
}
