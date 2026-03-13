import http from "@/functions/http";
import axios from "axios";

interface WebhookPayload {
  url: string;
}

interface UserWebhooks {
  id: string;
  userId: string;
  discordUrl: string | null;
  slackurl: string | null;
}

const handleError = (error: unknown, fallbackMessage: string): never => {
  console.error(fallbackMessage, error);
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message =
      error.response?.data?.message || error.message || fallbackMessage;
    throw { status, message };
  }
  throw { status: 500, message: "Unexpected error" };
};

// ─── Discord ───────────────────────────────────────────────────────────────

export const addDiscordWebhook = async (url: string) => {
  try {
    const res = await http.post<{ success: boolean; message: string; url: string }>(
      "/user/webhook/discord",
      { url } satisfies WebhookPayload,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    handleError(error, "Failed to add Discord webhook");
  }
};

export const updateDiscordWebhook = async (url: string) => {
  try {
    const res = await http.put<{ success: boolean; message: string; url: string }>(
      "/user/webhook/discord",
      { url } satisfies WebhookPayload,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    handleError(error, "Failed to update Discord webhook");
  }
};

export const removeDiscordWebhook = async () => {
  try {
    const res = await http.delete<{ success: boolean; message: string }>(
      "/user/webhook/discord",
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    handleError(error, "Failed to remove Discord webhook");
  }
};

// ─── Slack ─────────────────────────────────────────────────────────────────

export const addSlackWebhook = async (url: string) => {
  try {
    const res = await http.post<{ success: boolean; message: string; url: string }>(
      "/user/webhook/slack",
      { url } satisfies WebhookPayload,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    handleError(error, "Failed to add Slack webhook");
  }
};

export const updateSlackWebhook = async (url: string) => {
  try {
    const res = await http.put<{ success: boolean; message: string; url: string }>(
      "/integrations/slack",
      { url } satisfies WebhookPayload,
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    handleError(error, "Failed to update Slack webhook");
  }
};

export const removeSlackWebhook = async () => {
  try {
    const res = await http.delete<{ success: boolean; message: string }>(
      "/user/webhook/slack",
      { withCredentials: true }
    );
    return res.data;
  } catch (error) {
    handleError(error, "Failed to remove Slack webhook");
  }
};

// ─── Fetch ─────────────────────────────────────────────────────────────────

export const getUserWebhooks = async (): Promise<UserWebhooks | undefined> => {
  try {
    const res = await http.get<{ success: boolean; data: UserWebhooks }>(
      "/user/webhook/all",
      { withCredentials: true }
    );
    return res.data.data;
  } catch (error) {
    handleError(error, "Failed to fetch webhooks");
  }
};