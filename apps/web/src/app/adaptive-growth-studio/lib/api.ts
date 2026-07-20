import type { AgsBootstrap } from "./types";
const API_BASE = process.env.NEXT_PUBLIC_AVOS_API_URL ?? "http://localhost:3000";
export async function getAgsBootstrap(): Promise<AgsBootstrap> {
  const response = await fetch(`${API_BASE}/avos/products/adaptive-growth-studio/frontend/bootstrap`, { cache: "no-store" });
  if (!response.ok) throw new Error(`AGS bootstrap failed: ${response.status}`);
  return response.json() as Promise<AgsBootstrap>;
}