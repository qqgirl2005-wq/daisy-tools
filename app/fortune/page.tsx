import type { Metadata } from "next";
import Link from "next/link";
import FortuneDraw from "./fortune-draw";

export const metadata: Metadata = {
  title: "好運抽籤 | Daisy Tools",
  description: "搖一搖籤筒，抽出今天的運勢",
};

export default function FortunePage() {
  return (
    <main className="flex flex-1 flex-col items-center bg-[radial-gradient(circle_at_top,#9e2a22_0%,#5c130e_55%,#2e0806_100%)] px-4 py-10 text-white">
      <Link href="/" className="mb-4 self-start text-sm text-amber-100/70 hover:text-white">
        ← 回首頁
      </Link>
      <h1 className="mb-2 text-5xl font-black tracking-widest text-[#ffd76a] [text-shadow:0_4px_0_#7a3a00,0_0_24px_rgba(255,215,106,0.5)] sm:text-6xl">
        好運抽籤
      </h1>
      <FortuneDraw />
    </main>
  );
}
