"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TimelockEvent } from "@/functions/api/timelock"
import { ShieldAlertIcon, ShieldCheckIcon, HistoryIcon, Settings2Icon } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface TimelockHistoryTableProps {
  events: TimelockEvent[];
}

export function TimelockHistoryTable({ events }: TimelockHistoryTableProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "Triggered": return <ShieldAlertIcon className="size-3 text-amber-500" />;
      case "Unlocked": return <ShieldCheckIcon className="size-3 text-emerald-500" />;
      case "DurationUpdated": return <Settings2Icon className="size-3 text-blue-500" />;
      default: return <HistoryIcon className="size-3 text-zinc-500" />;
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case "Triggered": 
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] font-black uppercase tracking-widest px-1.5 py-0">Triggered</Badge>;
      case "Unlocked": 
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] font-black uppercase tracking-widest px-1.5 py-0">Unlocked</Badge>;
      case "DurationUpdated": 
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px] font-black uppercase tracking-widest px-1.5 py-0">Updated</Badge>;
      default: 
        return <Badge variant="outline" className="bg-zinc-500/10 text-zinc-500 border-zinc-500/20 text-[8px] font-black uppercase tracking-widest px-1.5 py-0">{type}</Badge>;
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-950/50 overflow-hidden shadow-2xl">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-[9px] font-black uppercase tracking-widest text-zinc-500 h-10 px-6">Event</TableHead>
            <TableHead className="text-[9px] font-black uppercase tracking-widest text-zinc-500 h-10 px-6">Target</TableHead>
            <TableHead className="text-[9px] font-black uppercase tracking-widest text-zinc-500 h-10 px-6">Details</TableHead>
            <TableHead className="text-[9px] font-black uppercase tracking-widest text-zinc-500 h-10 px-6 text-right">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow className="border-white/5">
              <TableCell colSpan={4} className="h-24 text-center text-zinc-600 text-[10px] font-mono italic">
                No events recorded yet.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getEventIcon(event.type)}
                    {getEventBadge(event.type)}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <code className="text-[10px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                    {event.target.substring(0, 10)}...{event.target.substring(event.target.length - 4)}
                  </code>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[200px] block">
                    {event.type === "DurationUpdated" ? `New duration: ${event.data.newDuration}s` : `Initiator: ${event.data.initiator?.substring(0, 6)}...`}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">
                    {formatDistanceToNow(event.timestamp * 1000)} ago
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
