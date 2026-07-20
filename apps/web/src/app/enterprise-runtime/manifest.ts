export const enterpriseRuntimeManifest = {
  id: "avos-enterprise-runtime",
  name: "AVOS Enterprise Application Runtime",
  version: "2.0.0",
  route: "/enterprise-runtime",
  capabilities: [
    "micro-frontends",
    "dynamic-loader",
    "permission-navigation",
    "real-time-notifications",
    "unified-search",
    "plugin-runtime",
    "feature-flags",
    "multi-tenant-workspaces",
    "live-observability",
    "offline-recovery",
    "ai-native-experience",
  ],
} as const;
