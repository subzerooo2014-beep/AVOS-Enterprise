export type AgsBootstrap = {
  studio: { name: string; version: string; status: string; score: number };
  tenant: { id: string; name: string };
  user: { id: string; name: string; roles: string[] };
  workspace: { id: string; name: string };
  navigation: Array<{ id: string; name: string; route: string; category: string }>;
  metrics: Array<{ id: string; title: string; value: string | number; trend: number }>;
  featureFlags: Record<string, boolean>;
};