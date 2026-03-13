import { create } from "zustand";
import { 
  getConfig, 
  getStatus, 
  getEvents, 
  TimelockConfig, 
  TimelockStatus, 
  TimelockEvent 
} from "@/functions/api/timelock";

interface TimelockState {
  config: TimelockConfig | null;
  activeStatus: Record<string, TimelockStatus>; // Map of target -> status
  events: TimelockEvent[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchConfig: () => Promise<void>;
  fetchStatus: (target: string) => Promise<void>;
  fetchEvents: (type?: string, range?: string) => Promise<void>;
  clearError: () => void;
}

export const useTimelockStore = create<TimelockState>((set, get) => ({
  config: null,
  activeStatus: {},
  events: [],
  loading: false,
  error: null,

  fetchConfig: async () => {
    set({ loading: true, error: null });
    try {
      const config = await getConfig();
      set({ config, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch config", loading: false });
    }
  },

  fetchStatus: async (target: string) => {
    set({ loading: true, error: null });
    try {
      const status = await getStatus(target);
      set((state) => ({
        activeStatus: { ...state.activeStatus, [target]: status },
        loading: false
      }));
    } catch (err: any) {
      set({ error: err.message || `Failed to fetch status for ${target}`, loading: false });
    }
  },

  fetchEvents: async (type?: string, range?: string) => {
    set({ loading: true, error: null });
    try {
      const events = await getEvents(type, range);
      set({ events, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch events", loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
