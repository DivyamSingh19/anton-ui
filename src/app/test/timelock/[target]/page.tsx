"use client"

import { useParams } from "next/navigation"
import { useEffect } from "react"
import { useTimelockStore } from "@/store/useTimelockStore"
import { TimelockOverviewCard } from "@/components/timelock/TimelockOverviewCard"
import { TimelockHistoryTable } from "@/components/timelock/TimelockHistoryTable"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ShieldAlertIcon, ShieldCheckIcon, HistoryIcon, Settings2Icon, LogOutIcon } from "lucide-react"
import Link from "next/link"

export default function TimelockTargetDetailPage() {
  const { target } = useParams();
  const targetStr = Array.isArray(target) ? target[0] : target;
  
  const { config, activeStatus, fetchStatus, fetchEvents, events, loading } = useTimelockStore();

  useEffect(() => {
    if (targetStr) {
      fetchStatus(targetStr);
      fetchEvents("Triggered", targetStr); // Fetch events for this specific target
    }
  }, [targetStr, fetchStatus, fetchEvents]);

  const status = activeStatus[targetStr || ""];

  return (
    <div className="flex flex-col gap-8 p-8 md:p-12 max-w-[1000px] mx-auto min-h-screen bg-[#0d0d0d]">
      <div className="flex items-center gap-4">
        <Link href="/test/timelock">
          <Button variant="ghost" className="size-10 p-0 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-all">
            <ChevronLeftIcon className="size-5" />
          </Button>
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Target Analysis</h1>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest leading-none">
            Detailed security state for {targetStr}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6">
          <TimelockOverviewCard
            target={targetStr || "0x..."}
            isLocked={status?.isLocked ?? true}
            lockDuration={status?.lockDuration ?? 3600}
            lockedUntil={status?.lockedUntil ?? Math.floor(Date.now() / 1000) + 1250}
            initiator={status?.initiator}
            className="w-full"
          />
          
          <div className="p-6 rounded-2xl bg-zinc-950 border border-white/5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Security Controls</h3>
            <div className="grid grid-cols-1 gap-3">
              <Button className="w-full bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest py-6 rounded-2xl justify-start px-6 transition-all group">
                <Settings2Icon className="size-4 mr-4 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                Update Duration
              </Button>
              <Button className="w-full bg-white/5 border border-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest py-6 rounded-2xl justify-start px-6 transition-all group">
                <LogOutIcon className="size-4 mr-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
                Cancel Proposal
              </Button>
              <Button className="w-full bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest py-6 rounded-2xl justify-start px-6 transition-all group">
                <ShieldCheckIcon className="size-4 mr-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                Manual Unlock
              </Button>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="flex items-center gap-3 pb-2 border-b border-white/5">
             <HistoryIcon className="size-4 text-zinc-500" />
             <h2 className="text-xs font-black uppercase tracking-widest text-white">Activity Log</h2>
          </div>
          <TimelockHistoryTable events={events} />
          
          <div className="rounded-2xl bg-white/[0.02] border border-dashed border-white/10 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="size-12 rounded-full bg-white/5 flex items-center justify-center">
              <ShieldAlertIcon className="size-6 text-zinc-600" />
            </div>
            <div className="space-y-1">
              <p className="text-white text-xs font-bold uppercase tracking-tight">Verifying integrity</p>
              <p className="text-zinc-600 text-[10px] font-mono max-w-[280px]">
                All transactions on this target are cross-referenced with the Kaizen Executor node.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
