"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimelockStatusBadge } from "./TimelockStatusBadge"
import { CountdownTimer } from "./CountdownTimer"
import { Button } from "@/components/ui/button"
import { ExternalLinkIcon, Settings2Icon, ShieldAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimelockOverviewCardProps {
  target: string;
  isLocked: boolean;
  lockDuration: number;
  lockedUntil: number;
  initiator?: string;
  className?: string;
}

export function TimelockOverviewCard({ 
  target, 
  isLocked, 
  lockDuration, 
  lockedUntil, 
  initiator,
  className 
}: TimelockOverviewCardProps) {
  const isReady = !isLocked || Date.now() / 1000 >= lockedUntil;
  
  return (
    <Card className={cn("bg-zinc-950 border-white/5 shadow-2xl overflow-hidden group hover:border-white/10 transition-all duration-300", className)}>
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent top-0" />
      
      <CardHeader className="flex flex-row items-baseline justify-between p-6 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em]">Target Address</CardTitle>
          <div className="flex items-center gap-2">
            <code className="text-white font-mono text-sm tracking-tighter truncate max-w-[180px]">{target}</code>
            <a href={`#`} className="text-zinc-600 hover:text-white transition-colors">
              <ExternalLinkIcon className="size-3" />
            </a>
          </div>
        </div>
        <TimelockStatusBadge isLocked={isLocked} lockedUntil={lockedUntil} />
      </CardHeader>
      
      <CardContent className="p-6 pt-2 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block">Lock duration</span>
            <span className="text-white font-mono text-xs">{lockDuration}s</span>
          </div>
          <div className="space-y-1">
            <span className="text-zinc-600 text-[9px] font-black uppercase tracking-widest block text-right">Timer</span>
            <div className="flex justify-end">
              {isLocked && !isReady ? (
                <CountdownTimer targetTimestamp={lockedUntil} />
              ) : (
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Ready</span>
              )}
            </div>
          </div>
        </div>
        
        {initiator && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-zinc-700" />
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Initiator</span>
            </div>
            <code className="text-zinc-400 font-mono text-[10px]">{initiator.substring(0, 10)}...</code>
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-[10px] font-black uppercase tracking-widest py-5 rounded-xl transition-all active:scale-95">
            <Settings2Icon className="size-3 mr-2" />
            Settings
          </Button>
          <Button className="flex-1 bg-white text-black hover:bg-zinc-200 text-[10px] font-black uppercase tracking-widest py-5 rounded-xl transition-all active:scale-95 shadow-xl shadow-white/5">
            <ShieldAlertIcon className="size-3 mr-2" />
            Unlock
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
