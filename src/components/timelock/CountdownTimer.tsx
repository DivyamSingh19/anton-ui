"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface CountdownTimerProps {
  targetTimestamp: number;
  onComplete?: () => void;
  className?: string;
}

export function CountdownTimer({ targetTimestamp, onComplete, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = targetTimestamp - now;
      if (diff <= 0) {
        setTimeLeft(0);
        onComplete?.();
        return false;
      }
      setTimeLeft(diff);
      return true;
    };

    calculateTime();
    const interval = setInterval(() => {
      if (!calculateTime()) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp, onComplete]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    return {
      h: h.toString().padStart(2, '0'),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  const { h, m, s } = formatTime(timeLeft);

  if (timeLeft === 0) return null;

  return (
    <div className={cn("flex items-center gap-1 font-mono text-sm tracking-tighter", className)}>
      <div className="flex flex-col items-center">
        <span className="text-white font-bold">{h}</span>
        <span className="text-[8px] uppercase text-zinc-500">h</span>
      </div>
      <span className="text-zinc-700 mx-0.5">:</span>
      <div className="flex flex-col items-center">
        <span className="text-white font-bold">{m}</span>
        <span className="text-[8px] uppercase text-zinc-500">m</span>
      </div>
      <span className="text-zinc-700 mx-0.5">:</span>
      <div className="flex flex-col items-center">
        <span className="text-white font-bold">{s}</span>
        <span className="text-[8px] uppercase text-zinc-500">s</span>
      </div>
    </div>
  );
}
