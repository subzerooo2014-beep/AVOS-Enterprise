export type F1Capability =
  | "WORKFLOW_ENGINE_V2"
  | "UNIVERSAL_NOTIFICATION_CENTER"
  | "ENTERPRISE_COMMAND_BUS"
  | "GLOBAL_SEARCH_ENGINE"
  | "ENTERPRISE_DASHBOARD_ENGINE"
  | "WIDGET_FRAMEWORK"
  | "DYNAMIC_DASHBOARD_BUILDER"
  | "AI_WORKSPACE_ENGINE"
  | "ENTERPRISE_TIMELINE_ENGINE"
  | "LIVE_ACTIVITY_ENGINE"
  | "REAL_TIME_EVENT_STREAM"
  | "ENTERPRISE_KPI_ENGINE"
  | "CROSS_MODULE_ANALYTICS"
  | "DASHBOARD_PERMISSION_ENGINE"
  | "ENTERPRISE_COMMAND_CENTER_CORE"
  | "BUSINESS_PULSE_ENGINE"
  | "AI_RECOMMENDATION_ENGINE_V2"
  | "UNIFIED_NAVIGATION_FRAMEWORK"
  | "WORKSPACE_PERSONALIZATION"
  | "ENTERPRISE_THEME_SYSTEM"
  | "MULTI_TENANT_DASHBOARD_PROFILES"
  | "DASHBOARD_LAYOUT_MANAGER"
  | "ENTERPRISE_LIVE_WIDGETS"
  | "ENTERPRISE_ACTIVITY_FEED"
  | "DASHBOARD_PERFORMANCE_OPTIMIZER";

export interface F1Workspace {
  id: string;
  tenantId: string;
  userId: string;
  name: string;
  direction: "RTL" | "LTR";
  theme: "LIGHT" | "DARK" | "SYSTEM";
  widgets: string[];
  navigation: string[];
  createdAt: string;
  updatedAt: string;
}

export interface F1Widget {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  capability: F1Capability;
  layout: { x: number; y: number; width: number; height: number };
  configuration: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}

export interface F1Activity {
  id: string;
  tenantId: string;
  type: string;
  title: string;
  description: string;
  severity: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
  createdAt: string;
}

export interface F1Command {
  id: string;
  tenantId: string;
  commandType: string;
  payload: Record<string, unknown>;
  status: "COMPLETED" | "FAILED";
  result: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface F1Recommendation {
  id: string;
  tenantId: string;
  title: string;
  rationale: string;
  confidence: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  action: string;
  status: "OPEN" | "ACCEPTED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}