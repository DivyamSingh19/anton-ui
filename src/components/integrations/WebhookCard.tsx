"use client";

import { useState } from "react";
import { 
  PlusIcon, 
  Trash2Icon, 
  ExternalLinkIcon, 
  CheckCircle2Icon,
  AlertCircleIcon,
  Loader2Icon
} from "lucide-react";
import { toast } from "sonner";

interface WebhookCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  url: string | null;
  platform: "discord" | "slack";
  onAdd: (url: string) => Promise<void>;
  onRemove: () => Promise<void>;
  onUpdate: (url: string) => Promise<void>;
}

export function WebhookCard({
  title,
  description,
  icon,
  url,
  platform,
  onAdd,
  onRemove,
  onUpdate
}: WebhookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputUrl, setInputUrl] = useState(url || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!inputUrl) {
      toast.error("Please enter a valid URL");
      return;
    }
    
    setLoading(true);
    try {
      if (url) {
        await onUpdate(inputUrl);
        toast.success(`${title} integration updated`);
      } else {
        await onAdd(inputUrl);
        toast.success(`${title} integration connected`);
      }
      setIsEditing(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save integration");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm(`Are you sure you want to disconnect ${title}?`)) return;
    
    setLoading(true);
    try {
      await onRemove();
      setInputUrl("");
      toast.success(`${title} integration removed`);
    } catch (err: any) {
      toast.error(err.message || "Failed to remove integration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative overflow-hidden bg-zinc-900/40 border border-white/[0.04] p-8 rounded-2xl hover:bg-zinc-900/60 transition-all duration-300">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <div className="p-3 rounded-2xl bg-zinc-800/50 text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-all duration-300">
            {icon}
          </div>
          {url ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2Icon className="size-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-500/10 border border-zinc-500/20 text-zinc-500">
              <AlertCircleIcon className="size-3" />
              <span className="text-[10px] font-black uppercase tracking-widest">Inactive</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">{title}</h3>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-8">{description}</p>
        </div>

        <div className="mt-auto pt-8 border-t border-white/[0.04]">
          {url && !isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/[0.02]">
                <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[200px]">{url}</span>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Edit
                </button>
              </div>
              <button
                disabled={loading}
                onClick={handleRemove}
                className="w-full h-12 flex items-center justify-center gap-2 border border-red-500/10 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500/10 transition-all rounded-xl"
              >
                {loading ? <Loader2Icon className="size-4 animate-spin" /> : (
                  <>
                    <Trash2Icon className="size-4" />
                    <span>Disconnect Instance</span>
                  </>
                )}
              </button>
            </div>
          ) : isEditing || !url ? (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder={`Enter ${title} webhook URL...`}
                  className="w-full bg-black/40 border border-white/[0.04] rounded-xl py-3 px-4 text-xs font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={loading}
                  onClick={handleSubmit}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all rounded-xl"
                >
                  {loading ? <Loader2Icon className="size-4 animate-spin" /> : (url ? "Update Config" : "Authorize Link")}
                </button>
                {isEditing && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 h-12 border border-white/[0.04] text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all rounded-xl"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
