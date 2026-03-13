"use client"

import { useState, useEffect } from "react"
import { useTimelockStore } from "@/store/useTimelockStore"
import { TimelockOverviewCard } from "@/components/timelock/TimelockOverviewCard"
import { TriggerTimelockForm } from "@/components/timelock/TriggerTimelockForm"
import { TimelockHistoryTable } from "@/components/timelock/TimelockHistoryTable"
import { ShieldCheckIcon, ShieldAlertIcon, ActivityIcon, CpuIcon, GlobeIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function TimelockPage() {
  const { config, events, activeStatus, fetchConfig, fetchEvents, loading } = useTimelockStore();

  useEffect(() => {
    fetchConfig();
    fetchEvents();
  }, [fetchConfig, fetchEvents]);

  // Mocking some targets since backend might be empty
  const mockTargets = [
    "0x95222290DD3078361406754A1130AD021920F925",
    "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
  ];

  return (
    <div className="flex flex-col gap-8 p-8 md:p-12 max-w-[1400px] mx-auto min-h-screen bg-[#0d0d0d]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
            <ShieldCheckIcon className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Security Protocol</span>
          </div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter sm:text-5xl">
            Timelock <span className="text-zinc-500">Systems</span>
          </h1>
          <p className="text-zinc-500 font-mono text-xs max-w-lg">
            Monitor and manage cryptographically enforced delays for high-privilege contract operations.
          </p>
        </div>
        <TriggerTimelockForm />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          label="Default Delay" 
          value={`${config?.DEFAULT_LOCK_DURATION || "..."}s`} 
          icon={<ActivityIcon className="size-4" />}
          subValue="Standard security window"
        />
        <StatCard 
          label="Control Hub" 
          value="Kaizen Executor" 
          icon={<CpuIcon className="size-4" />}
          subValue={config?.KAIZEN_EXECUTOR?.substring(0, 16) + "..."}
        />
        <StatCard 
          label="Network" 
          value="Mainnet" 
          icon={<GlobeIcon className="size-4" />}
          subValue="Synchronized node state"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Monitoring */}
        <div className="xl:col-span-8 space-y-8">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Active Locks</h2>
              <span className="text-[10px] font-mono text-zinc-600">Total: {Object.keys(activeStatus).length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTargets.map((target) => (
                <TimelockOverviewCard
                  key={target}
                  target={target}
                  isLocked={true}
                  lockDuration={3600}
                  lockedUntil={Math.floor(Date.now() / 1000) + 1250}
                  initiator="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
             <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-white">Recent Security Events</h2>
              <span className="text-[10px] font-mono text-zinc-600 cursor-pointer hover:text-white transition-colors">View All</span>
            </div>
            <TimelockHistoryTable events={events} />
          </section>
        </div>

        {/* Right Column: Information & Guidelines */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="bg-zinc-950 border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <ShieldAlertIcon className="size-24 rotate-12" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Protocol Safety</h3>
            <div className="space-y-4 font-mono text-[10px] text-zinc-500 leading-relaxed">
              <p>
                <span className="text-emerald-500 font-bold mr-1">01.</span> All critical state changes must be queued via the Timelock contract to prevent immediate malicious takeovers.
              </p>
              <p>
                <span className="text-emerald-500 font-bold mr-1">02.</span> Once triggered, a proposal cannot be accelerated. It must wait the full <span className="text-white">lockDuration</span>.
              </p>
              <p>
                <span className="text-emerald-500 font-bold mr-1">03.</span> After the delay period expires, any user can trigger the execution of the original data.
              </p>
            </div>
          </Card>

          <Card className="bg-emerald-500 border-none rounded-2xl p-6 shadow-2xl shadow-emerald-500/10 active:scale-[0.98] transition-all cursor-pointer">
            <h3 className="text-sm font-black uppercase tracking-widest text-black mb-1 text-center">Documentation</h3>
            <p className="text-emerald-950 text-[10px] font-bold text-center uppercase tracking-tighter opacity-70">
              Read the full security whitepaper
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, subValue }: { label: string, value: string, icon: React.ReactNode, subValue?: string }) {
  return (
    <Card className="bg-zinc-950/50 backdrop-blur-sm border-white/5 rounded-2xl group hover:border-white/10 transition-all duration-300">
      <CardContent className="p-6 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-white/5 text-zinc-400 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
          {icon}
        </div>
        <div className="space-y-1">
          <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest block">{label}</span>
          <div className="flex flex-col">
            <span className="text-white text-lg font-black tracking-tight tracking-[-0.02em]">{value}</span>
            {subValue && <span className="text-zinc-600 text-[9px] font-mono">{subValue}</span>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
