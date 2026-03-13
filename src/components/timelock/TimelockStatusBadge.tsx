"use client"

import { Badge } from "@/components/ui/badge"
import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface TimelockStatusBadgeProps {
  isLocked: boolean;
  lockedUntil?: number;
  className?: string;
}

export function TimelockStatusBadge({ isLocked, lockedUntil, className }: TimelockStatusBadgeProps) {
  const isReady = !isLocked || (lockedUntil && Date.now() / 1000 >= lockedUntil);
  
  const statusLabel = isLocked ? (isReady ? "Ready" : "Locked") : "Unlocked";
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-full border shadow-sm transition-all duration-300",
            isLocked 
              ? (isReady 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20")
              : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
            className
          )}
        >
          {isLocked ? (
            isReady ? (
              <ShieldCheckIcon className="size-3.5" />
            ) : (
              <ShieldAlertIcon className="size-3.5 animate-pulse" />
            )
          ) : (
            <ShieldCheckIcon className="size-3.5 opacity-50" />
          )}
          <span className="text-[10px] font-black uppercase tracking-widest">{statusLabel}</span>
        </Badge>
      </TooltipTrigger>
      {lockedUntil && isLocked && !isReady && (
        <TooltipContent className="bg-zinc-950 border-white/5 text-[10px] font-mono p-2">
          Unlocks on {new Date(lockedUntil * 1000).toLocaleString()}
        </TooltipContent>
      )}
    </Tooltip>
  );
}
