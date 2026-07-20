import type { AgsLiveIntelligence } from "./live-types";

const API_BASE =
  process.env.NEXT_PUBLIC_AVOS_API_URL ??
  "http://localhost:3000";

export async function getAgsLiveIntelligence(): Promise<AgsLiveIntelligence> {
  const response = await fetch(
    `${API_BASE}/avos/products/adaptive-growth-studio/live/snapshot`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Unable to load AGS live intelligence: ${response.status}`);
  }

  return response.json() as Promise<AgsLiveIntelligence>;
}