import type { GetMessagesParams, Message } from "../types/message";

const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, ""),
  token: import.meta.env.VITE_API_TOKEN,
};

if (!API_CONFIG.baseUrl) {
  throw new Error("Missing VITE_API_BASE_URL");
}

if (!API_CONFIG.token) {
  throw new Error("Missing VITE_API_TOKEN");
}

const buildQuery = (params: GetMessagesParams = {}) => {
  const searchParams = new URLSearchParams();

  if (params.limit != null) searchParams.set("limit", String(params.limit));
  if (params.before) searchParams.set("before", params.before);
  if (params.after) searchParams.set("after", params.after);

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const request = async <T>(endpoint: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_CONFIG.token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const getMessages = (params: GetMessagesParams = {}) =>
  request<Message[]>(`/messages${buildQuery(params)}`);

export const createMessage = (payload: { message: string; author: string }) =>
  request<Message>("/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
