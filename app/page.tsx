import Link from "next/link";

const TOOLS = [
  {
    href: "/lottery",
    emoji: "🎡",
    name: "幸運大轉盤",
    tag: "抽獎",
    description: "輸入名單，轉動轉盤抽出幸運兒",
    color: "from-[#2f9e6a] to-[#0f5a36]",
    glow: "group-hover:shadow-[0_20px_50px_-12px_rgba(47,158,106,0.6)]",
  },
  {
    href: "/pomodoro",
    emoji: "🍅",
    name: "蕃茄鐘",
    tag: "專注",
    description: "專注 25 分鐘、休息 5 分鐘，讓工作更專心",
    color: "from-[#d9483a] to-[#7a1f17]",
    glow: "group-hover:shadow-[0_20px_50px_-12px_rgba(217,72,58,0.6)]",
  },
  {
    href: "/fortune",
    emoji: "🏮",
    name: "好運抽籤",
    tag: "運勢",
    description: "搖一搖籤筒，從大吉到大凶，看看今天運勢",
    color: "from-[#e0a020] to-[#9e2a22]",
    glow: "group-hover:shadow-[0_20px_50px_-12px_rgba(224,160,32,0.6)]",
  },
] as const;

const PETALS = 12;

// 小雛菊：花瓣繞著中心旋轉排列
function Daisy({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      {Array.from({ length: PETALS }, (_, i) => (
        <ellipse
          key={i}
          cx={100}
          cy={52}
          rx={17}
          ry={44}
          fill="#ffffff"
          stroke="#f1e6c8"
          strokeWidth={2}
          transform={`rotate(${(360 / PETALS) * i} 100 100)`}
        />
      ))}
      <circle cx={100} cy={100} r={30} fill="#f7c531" />
      <circle cx={100} cy={100} r={30} fill="url(#daisy-center)" />
      <defs>
        <radialGradient id="daisy-center" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffe58a" />
          <stop offset="100%" stopColor="#e09a12" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-900/5 bg-[#fffaf0]/75 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/70">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-wide text-zinc-900 dark:text-zinc-50">
          <Daisy className="h-8 w-8" />
          Daisy Tools
        </Link>
        <nav className="flex items-center gap-1 text-sm font-bold sm:gap-2">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-full px-3 py-2 text-zinc-600 transition hover:bg-zinc-900/5 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <span className="sm:mr-1">{tool.emoji}</span>
              <span className="hidden sm:inline">{tool.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-zinc-900/5 bg-[#fff4dc] dark:border-white/10 dark:bg-zinc-900">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-[2fr_1fr_1fr] sm:px-6">
        <div>
          <p className="flex items-center gap-2 text-lg font-black text-zinc-900 dark:text-zinc-50">
            <Daisy className="h-7 w-7" />
            Daisy Tools
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            一個人慢慢做出來的小工具箱。每個工具都只做好一件事，打開就能用，不用註冊。
          </p>
        </div>
        <div>
          <p className="text-sm font-black text-zinc-900 dark:text-zinc-50">工具</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link href={tool.href} className="hover:text-zinc-900 dark:hover:text-white">
                  {tool.emoji} {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-black text-zinc-900 dark:text-zinc-50">關於</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <li>用 Next.js 製作</li>
            <li>AI coding 無痛上手練習作品</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-zinc-900/5 py-5 text-center text-xs text-zinc-500 dark:border-white/10">
        © 2026 Daisy Tools・Made with 🌼
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-hidden bg-[#fffaf0] dark:bg-zinc-950">
        {/* Hero */}
        <section className="relative">
          {/* 背景光暈 */}
          <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#ffd76a]/40 blur-3xl dark:bg-[#ffd76a]/10" />
          <div className="pointer-events-none absolute -right-24 top-24 h-80 w-80 rounded-full bg-[#ff9f8a]/30 blur-3xl dark:bg-[#ff9f8a]/10" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#00000010_1px,transparent_1px)] [background-size:22px_22px] dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)]" />

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:py-28">
            <div className="text-center lg:text-left">
              <p className="inline-flex items-center gap-2 rounded-full border border-[#e0a020]/30 bg-white/70 px-4 py-1.5 text-sm font-bold text-[#b0700a] shadow-sm dark:bg-white/5 dark:text-[#ffd76a]">
                <span className="h-2 w-2 rounded-full bg-[#5ac46a]" />
                {TOOLS.length} 個小工具，持續增加中
              </p>
              <h1 className="mt-6 text-5xl font-black leading-tight tracking-tight text-zinc-900 sm:text-6xl dark:text-zinc-50">
                讓每天的小事
                <br />
                <span className="bg-gradient-to-r from-[#e0a020] via-[#e0603a] to-[#c0392b] bg-clip-text text-transparent">
                  變得有趣一點
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-zinc-600 lg:mx-0 dark:text-zinc-400">
                抽獎、專注、看運勢——Daisy 的小工具箱，點一下就能使用。
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
                <a
                  href="#tools"
                  className="rounded-full bg-zinc-900 px-7 py-3 font-bold text-white shadow-[0_6px_0_#000] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_2px_0_#000] dark:bg-[#ffd76a] dark:text-zinc-900 dark:shadow-[0_6px_0_#a06a00]"
                >
                  開始探索 ↓
                </a>
                <Link
                  href="/fortune"
                  className="rounded-full border-2 border-zinc-900/10 bg-white/70 px-7 py-3 font-bold text-zinc-800 transition hover:border-zinc-900/30 dark:border-white/15 dark:bg-white/5 dark:text-zinc-100"
                >
                  🏮 抽今日運勢
                </Link>
              </div>
            </div>

            {/* 主視覺：旋轉的雛菊與漂浮的工具圖示 */}
            <div className="relative mx-auto aspect-square w-[min(380px,80vw)]">
              <Daisy className="absolute inset-0 h-full w-full animate-spin-slow drop-shadow-[0_20px_40px_rgba(224,160,32,0.35)]" />
              {TOOLS.map((tool, i) => (
                // 外層負責漂浮動畫，內層負責 hover 放大，兩個 transform 才不會互相蓋掉
                <div
                  key={tool.href}
                  className={`absolute animate-float ${["-left-2 top-6", "-right-2 top-1/3", "bottom-0 left-1/4"][i]}`}
                  style={{ animationDelay: `${i * -2}s` }}
                >
                  <Link
                    href={tool.href}
                    aria-label={tool.name}
                    className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.color} text-3xl shadow-xl ring-4 ring-white transition hover:scale-110 dark:ring-zinc-900`}
                  >
                    {tool.emoji}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 工具列表 */}
        <section id="tools" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-24 sm:px-6">
          <div className="mb-10 flex flex-col items-center text-center">
            <p className="text-sm font-black tracking-[0.3em] text-[#e0603a]">TOOLS</p>
            <h2 className="mt-2 text-3xl font-black text-zinc-900 sm:text-4xl dark:text-zinc-50">挑一個來玩玩</h2>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className={`group relative flex h-full flex-col gap-3 overflow-hidden rounded-3xl bg-gradient-to-br ${tool.color} p-7 text-white shadow-lg transition duration-300 hover:-translate-y-2 ${tool.glow}`}
                >
                  {/* 右上角的大圖示當背景裝飾 */}
                  <span className="pointer-events-none absolute -right-6 -top-6 text-[9rem] leading-none opacity-15 transition duration-500 group-hover:rotate-12 group-hover:scale-110">
                    {tool.emoji}
                  </span>
                  <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur">
                    {tool.tag}
                  </span>
                  <span className="text-5xl transition group-hover:scale-110">{tool.emoji}</span>
                  <span className="text-2xl font-bold">{tool.name}</span>
                  <span className="text-sm leading-relaxed text-white/80">{tool.description}</span>
                  <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-bold">
                    開始使用
                    <span className="transition group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
