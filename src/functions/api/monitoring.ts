import http from "@/functions/http";
import axios from "axios";

interface StartMonitoringPayload {
  projectId: string;
}

interface MonitoringViewParams {
  projectId?: string;
}

export const startMonitoring = async (payload: StartMonitoringPayload) => {
  try {
    const res = await http.post("/user/monitoring/start", payload, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error while starting monitoring", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to start monitoring";

      throw { status, message };
    }

    throw {
      status: 500,
      message: "Unexpected error",
    };
  }
};

export const viewMonitoring = async (params?: MonitoringViewParams) => {
  try {
    const res = await http.get("/user/monitoring/view", {
      withCredentials: true,
      params: {
        ...(params?.projectId ? { projectId: params.projectId } : {}),
      },
    });
    return res.data.data;
  } catch (error) {
    console.error("Error while fetching monitoring list", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch monitoring data";

      throw { status, message };
    }

    throw {
      status: 500,
      message: "Unexpected error",
    };
  }
};