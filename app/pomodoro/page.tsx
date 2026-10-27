import type { Metadata } from "next";
import PomodoroTimer from "./pomodoro-timer";

export const metadata: Metadata = {
  title: "蕃茄鐘 | Daisy Tools",
  description: "專注工作 25 分鐘、休息 5 分鐘的蕃茄工作法計時器",
};

export default function PomodoroPage() {
  return <PomodoroTimer />;
}
