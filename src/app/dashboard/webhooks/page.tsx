"use client";

import { useEffect, useState } from "react";
import { 
  ZapIcon, 
  ActivityIcon,
  ShieldCheckIcon,
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

// Official Discord brand icon (SVG)
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Discord"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// Official Slack brand icon (SVG)
const SlackIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Slack"
  >
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  </svg>
);

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
          icon={<DiscordIcon className="size-6" />}
          url={webhooks?.discordUrl || null}
          platform="discord"
          onAdd={async (url) => { await addDiscordWebhook(url); await fetchWebhooks(); }}
          onUpdate={async (url) => { await updateDiscordWebhook(url); await fetchWebhooks(); }}
          onRemove={async () => { await removeDiscordWebhook(); await fetchWebhooks(); }}
        />
        <WebhookCard
          title="Slack"
          description="Streamline team collaboration by piping execution logs and deployment triggers into Slack."
          icon={<SlackIcon className="size-6" />}
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