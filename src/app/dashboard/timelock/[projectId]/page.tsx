"use client"

import React, { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  LockIcon, 
  UnlockIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  ArrowLeftIcon,
  Loader2Icon,
  TimerIcon,
  AlertTriangleIcon,
  SettingsIcon,
  PlayIcon,
  RefreshCwIcon
} from "lucide-react"
import { getProjectById } from "@/functions/api/projects"
import { 
  getTimelockStatus, 
  getIsLocked, 
  getLockDuration, 
  getLockedUntil,
  triggerTimelock,
  manualUnlock,
  setLockDuration
} from "@/functions/api/timelock"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { toast } from "sonner"

interface Project {
  id: string;
  title: string;
  contractAddress: string;
}

export default function TimelockDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  
  const [project, setProject] = useState<Project | null>(null);
  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [lockDuration, setLockDurationVal] = useState<number | null>(null);
  const [lockedUntil, setLockedUntilVal] = useState<number | null>(null);
  const [status, setStatus] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const proj = await getProjectById(projectId);
      setProject(proj);

      if (proj?.contractAddress) {
        const [locked, duration, until, stat] = await Promise.all([
          getIsLocked(proj.contractAddress),
          getLockDuration(proj.contractAddress),
          getLockedUntil(proj.contractAddress),
          getTimelockStatus(proj.contractAddress)
        ]);

        setIsLocked(locked);
        setLockDurationVal(duration);
        setLockedUntilVal(until);
        setStatus(stat);
      }
    } catch (err) {
      console.error("Failed to fetch timelock data", err);
      toast.error("Failed to sync timelock state");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [projectId, fetchData]);

  const handleTrigger = async () => {
    if (!project?.contractAddress) return;
    setActionLoading("trigger");
    try {
      // Mocking callData for typical emergency pause
      await triggerTimelock({ 
        target: project.contractAddress, 
        callData: "0x" 
      });
      toast.success("Timelock activation sequence initiated");
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Activation failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnlock = async () => {
    if (!project?.contractAddress) return;
    setActionLoading("unlock");
    try {
      await manualUnlock({ 
        target: project.contractAddress, 
        callData: "0x" 
      });
      toast.success("Protocol manual unlock complete");
      fetchData(true);
    } catch (err: any) {
      toast.error(err.message || "Unlock failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2Icon className="size-8 text-primary animate-spin" />
        <p className="text-[10px] uppercase font-black tracking-[0.3em] text-zinc-500 italic">Syncing security state...</p>
      </div>
    );
  }

  if (!project) return null;

  const getTimeRemaining = () => {
    if (!lockedUntil) return null;
    const now = Math.floor(Date.now() / 1000);
    const diff = lockedUntil - now;
    if (diff <= 0) return "Expired";
    
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m remaining`;
  };

  return (
    <div className="text-zinc-100 font-mono w-full pb-20">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">
          <Link href="/dashboard/timelock" className="hover:text-white transition-colors flex items-center gap-2">
            <ArrowLeftIcon size={12} /> Hub
          </Link>
          <span className="text-zinc-800">/</span>
          <span className="text-primary italic">Control_{project.id.substring(0, 4)}</span>
        </div>
        <button 
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-[9px] font-black uppercase tracking-widest border border-white/5 bg-zinc-900/40 hover:bg-zinc-800 rounded-lg transition-all"
        >
          <RefreshCwIcon size={12} className={refreshing ? "animate-spin text-primary" : ""} />
          {refreshing ? "Refreshing..." : "Re-sync"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Status and Info */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
               <span className={`size-2 rounded-full ${isLocked ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`} />
               <span className={`text-[10px] font-black uppercase tracking-[0.3em] italic ${isLocked ? "text-red-400" : "text-emerald-400"}`}>
                 {isLocked ? "System Locked" : "System Operative"}
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-none mb-6">
              {project.title}
            </h1>
            <p className="text-xs text-zinc-500 bg-white/5 border border-white/5 px-3 py-2 rounded-lg w-fit select-all">
              {project.contractAddress}
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="bg-zinc-900/40 border-white/[0.04]">
               <CardHeader>
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Lock Window</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-end gap-3">
                    <span className="text-3xl font-black text-white italic">{lockDuration ? (lockDuration / 60).toFixed(0) : "0"}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-1">Minutes</span>
                  </div>
                  <p className="text-[9px] text-zinc-600 mt-4 uppercase tracking-tighter">Delay required for security interventions</p>
               </CardContent>
             </Card>

             <Card className="bg-zinc-900/40 border-white/[0.04]">
               <CardHeader>
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Time Execution</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="flex items-end gap-3">
                    <span className="text-2xl font-black text-white italic">{isLocked ? getTimeRemaining() : "N/A"}</span>
                  </div>
                  <p className="text-[9px] text-zinc-600 mt-4 uppercase tracking-tighter">
                    {isLocked ? "Time until unlock is possible" : "No active lock sequence"}
                  </p>
               </CardContent>
             </Card>
          </div>

          <Card className="bg-zinc-900/20 border-white/[0.04] p-8 border-dashed border-2">
             <div className="flex items-start gap-4 text-zinc-400">
               <AlertTriangleIcon className="shrink-0 text-amber-500/50" />
               <div className="space-y-4">
                 <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Protocol Override Warning</h4>
                 <p className="text-xs leading-relaxed opacity-60">
                   Timelock mechanisms are designed to prevent immediate malicious takeovers. 
                   Activating a lock will prevent any transactions from reaching the target contract for the duration of the window.
                 </p>
               </div>
             </div>
          </Card>
        </div>

        {/* Right Col: Controls */}
        <div className="space-y-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 ml-2 mb-4">Command Center</h3>
           
           <button 
             onClick={handleTrigger}
             disabled={!!isLocked || !!actionLoading}
             className="w-full flex items-center justify-between p-6 bg-zinc-900/40 border border-white/[0.04] rounded-2xl hover:bg-red-500/10 hover:border-red-500/30 transition-all group disabled:opacity-30 disabled:hover:bg-zinc-900/40 disabled:hover:border-white/[0.04]"
           >
             <div className="text-left">
               <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Action_01</span>
               <span className="text-sm font-black text-white group-hover:text-red-400 uppercase italic">Trigger Lock</span>
             </div>
             {actionLoading === "trigger" ? <Loader2Icon className="animate-spin text-red-400" /> : <PlayIcon className="text-zinc-800 group-hover:text-red-400 transition-colors" />}
           </button>

           <button 
             onClick={handleUnlock}
             disabled={!isLocked || !!actionLoading}
             className="w-full flex items-center justify-between p-6 bg-zinc-900/40 border border-white/[0.04] rounded-2xl hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group disabled:opacity-30 disabled:hover:bg-zinc-900/40 disabled:hover:border-white/[0.04]"
           >
             <div className="text-left">
               <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Action_02</span>
               <span className="text-sm font-black text-white group-hover:text-emerald-400 uppercase italic">Manual Unlock</span>
             </div>
             {actionLoading === "unlock" ? <Loader2Icon className="animate-spin text-emerald-400" /> : <UnlockIcon className="text-zinc-800 group-hover:text-emerald-400 transition-colors" />}
           </button>

           <button className="w-full flex items-center justify-between p-6 bg-zinc-900/40 border border-white/[0.04] rounded-2xl hover:bg-white/5 transition-all group opacity-50 cursor-not-allowed">
             <div className="text-left">
               <span className="block text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Action_03</span>
               <span className="text-sm font-black text-white uppercase italic">Config Window</span>
             </div>
             <SettingsIcon className="text-zinc-800 group-hover:text-white transition-colors" />
           </button>

           <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl mt-8">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheckIcon className="text-primary size-4" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Security Status</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-relaxed uppercase">
                Hardware security module is online. All commands are signed and logged for audit.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}