"use client";

import { useEffect, useState } from "react";
import { 
  BellRingIcon, 
  MessageSquareIcon, 
  ZapIcon, 
  ActivityIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowUpRightIcon
} from "lucide-react";
import { 
  getUserWebhooks, 
  addDiscordWebhook, 
  updateDiscordWebhook, 
  removeDiscordWebhook,
  addSlackWebhook,
  updateSlackWebhook,
  removeSlackWebhook
} from "@/functions/api/webhook";
import { WebhookCard } from "@/components/integrations/WebhookCard";

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<{ discordUrl: string | null; slackUrl?: string | null; slackurl?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWebhooks = async () => {
    try {
      const data = await getUserWebhooks();
      setWebhooks(data || { discordUrl: null, slackUrl: null });
    } catch (err) {
      console.error("Failed to load webhooks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 bg-zinc-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-zinc-100 font-mono w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
        <div>
          <p className="text-[10px] tracking-[0.4em] text-zinc-500 uppercase mb-4 leading-none font-bold italic">
            Connectivity Matrix
          </p>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none italic">
            Integrations
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-1">Network Status</span>
            <div className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Global Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12">
        <WebhookCard
          title="Discord"
          description="Forward real-time contract events and system alerts directly to your Discord channels."
          icon={<BellRingIcon className="size-6" />}
          url={webhooks?.discordUrl || null}
          platform="discord"
          onAdd={async (url) => { await addDiscordWebhook(url); await fetchWebhooks(); }}
          onUpdate={async (url) => { await updateDiscordWebhook(url); await fetchWebhooks(); }}
          onRemove={async () => { await removeDiscordWebhook(); await fetchWebhooks(); }}
        />
        <WebhookCard
          title="Slack"
          description="Streamline team collaboration by piping execution logs and deployment triggers into Slack."
          icon={<MessageSquareIcon className="size-6" />}
          url={webhooks?.slackUrl || webhooks?.slackurl || null}
          platform="slack"
          onAdd={async (url) => { await addSlackWebhook(url); await fetchWebhooks(); }}
          onUpdate={async (url) => { await updateSlackWebhook(url); await fetchWebhooks(); }}
          onRemove={async () => { await removeSlackWebhook(); await fetchWebhooks(); }}
        />
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Active Channels", value: (webhooks?.discordUrl ? 1 : 0) + (webhooks?.slackUrl || webhooks?.slackurl ? 1 : 0), icon: <ZapIcon className="size-4" /> },
          { label: "Relay Latency", value: "< 240ms", icon: <ShieldCheckIcon className="size-4" /> },
          { label: "Daily Dispatch", value: "0/10k", icon: <ActivityIcon className="size-4" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900/40 border border-white/[0.04] p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/[0.03] text-zinc-500">
                {stat.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{stat.label}</span>
            </div>
            <span className="text-2xl font-black text-white italic">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
