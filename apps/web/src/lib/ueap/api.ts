import type {
  FeatureFlag,
  RuntimeApplication,
  RuntimeNotification,
  RuntimeSnapshot,
  Tenant,
  Workspace,
} from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_AVOS_API_BASE_URL ?? "http://localhost:3000";

async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return fallback;
    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export const ueapApi = {
  status: (fallback: RuntimeSnapshot) =>
    getJson<RuntimeSnapshot>("/avos/web-runtime/status", fallback),
  applications: (fallback: RuntimeApplication[]) =>
    getJson<RuntimeApplication[]>("/avos/web-runtime/applications", fallback),
  tenants: (fallback: Tenant[]) =>
    getJson<Tenant[]>("/avos/web-runtime/tenants", fallback),
  workspaces: (fallback: Workspace[]) =>
    getJson<Workspace[]>("/avos/web-runtime/workspaces", fallback),
  notifications: (fallback: RuntimeNotification[]) =>
    getJson<RuntimeNotification[]>("/avos/web-runtime/notifications", fallback),
  featureFlags: (fallback: FeatureFlag[]) =>
    getJson<FeatureFlag[]>("/avos/web-runtime/feature-flags", fallback),
};
