import http from "@/functions/http";
import axios from "axios";

export interface TimelockConfig {
  DEFAULT_LOCK_DURATION: number;
  MAX_LOCK_DURATION: number;
  KAIZEN_EXECUTOR: string;
}

export interface TimelockStatus {
  target: string;
  isLocked: boolean;
  lockDuration: number;
  lockedUntil: number;
  initiator?: string;
}

export interface TimelockEvent {
  id: string;
  type: "Triggered" | "Unlocked" | "DurationUpdated";
  target: string;
  timestamp: number;
  data: any;
}

export const getConfig = async (): Promise<TimelockConfig> => {
  try {
    const res = await http.get("/timelock/config");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status, message: error.response?.data?.message || "Failed to fetch timelock config" };
    }
    throw { status: 500, message: "Unexpected error" };
  }
};

export const getStatus = async (target: string): Promise<TimelockStatus> => {
  try {
    const res = await http.get(`/timelock/status/${target}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status, message: error.response?.data?.message || `Failed to fetch status for ${target}` };
    }
    throw { status: 500, message: "Unexpected error" };
  }
};

export const triggerTimelock = async (target: string, callData: string) => {
  try {
    const res = await http.post("/timelock/trigger", { target, callData });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status, message: error.response?.data?.message || "Failed to trigger timelock" };
    }
    throw { status: 500, message: "Unexpected error" };
  }
};

export const manualUnlock = async (target: string) => {
  try {
    const res = await http.post("/timelock/unlock", { target });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status, message: error.response?.data?.message || "Emergency unlock failed" };
    }
    throw { status: 500, message: "Unexpected error" };
  }
};

export const setLockDuration = async (target: string, duration: number) => {
  try {
    const res = await http.put("/timelock/duration", { target, duration });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status, message: error.response?.data?.message || "Failed to update lock duration" };
    }
    throw { status: 500, message: "Unexpected error" };
  }
};

export const getEvents = async (type?: string, range?: string): Promise<TimelockEvent[]> => {
  try {
    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (range) params.append("range", range);
    
    const res = await http.get(`/timelock/events?${params.toString()}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw { status: error.response?.status, message: error.response?.data?.message || "Failed to fetch timelock events" };
    }
    throw { status: 500, message: "Unexpected error" };
  }
};
