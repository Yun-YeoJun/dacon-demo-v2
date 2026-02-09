export type Label = "스미싱" | "정상" | "불명";

export interface AnalyzeResult {
  label: Label;
  score?: number | null;
  reasons: string[];
  raw?: any;
}

export interface AnalyzeResponse {
  request_id: string;
  result: AnalyzeResult;
}

function getBaseUrl(): string {
  // VITE_API_BASE 예: http://localhost:8000  (없으면 same-origin)
  const envBase = (import.meta as any).env?.VITE_API_BASE as string | undefined;
  return (envBase && envBase.trim()) ? envBase.replace(/\/$/, "") : "";
}

async function http<T>(path: string, init: RequestInit): Promise<T> {
  const base = getBaseUrl();
  const url = `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  analyze: (text: string, request_id?: string, channel?: string) =>
    http<AnalyzeResponse>("/api/v1/analyze", {
      method: "POST",
      body: JSON.stringify({ text, request_id, channel }),
    }),
};
