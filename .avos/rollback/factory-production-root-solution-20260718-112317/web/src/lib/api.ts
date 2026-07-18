export interface AvosApiStatus {
  name: string;
  status: string;
  api: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_AVOS_API_URL ??
  "http://localhost:3000";

export async function getApiStatus(): Promise<{
  online: boolean;
  data?: AvosApiStatus;
}> {
  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });

    if (!response.ok) {
      return { online: false };
    }

    const data =
      (await response.json()) as AvosApiStatus;

    return {
      online:
        data.status === "OK" &&
        data.api === "running",
      data,
    };
  } catch {
    return { online: false };
  }
}
