export type F5Capability =
  | "AVOS_SMART_WORKSPACE"
  | "AVOS_LIVE_COMMAND"
  | "AVOS_COCKPIT"
  | "AVOS_STORY_MODE"
  | "AVOS_BUSINESS_PULSE"
  | "AVOS_AI_INBOX"
  | "AVOS_DAILY_MISSION"
  | "AVOS_LIVE_ACTIVITY_FEED"
  | "AVOS_OFFICE_VIEW"
  | "DIGITAL_EMPLOYEES"
  | "SALES_MANAGER_AI"
  | "FINANCE_MANAGER_AI"
  | "MARKETING_MANAGER_AI"
  | "INVENTORY_MANAGER_AI"
  | "CEO_ADVISOR_AI"
  | "AI_DAILY_BRIEFING"
  | "AI_ONE_CLICK"
  | "ROLE_BASED_DASHBOARDS"
  | "CUSTOMIZABLE_DASHBOARD_LAYOUTS"
  | "ADVERTISEMENT_ANALYTICS_WIDGETS"
  | "VEHICLE_360_WORKSPACE"
  | "CUSTOMER_360_WORKSPACE"
  | "DEALER_360_WORKSPACE"
  | "MARKET_360_WORKSPACE"
  | "AI_360_WORKSPACE"
  | "UNIFIED_TIMELINE"
  | "MISSION_CONTROL"
  | "COMMAND_PALETTE"
  | "GLOBAL_SEARCH_WORKSPACE"
  | "WORKSPACE_PERSONALIZATION";

export interface F5Workspace {
  id: string;
  tenantId: string;
  userId: string;
  role: string;
  name: string;
  theme: "LIGHT" | "DARK" | "SYSTEM";
  direction: "RTL" | "LTR";
  widgets: string[];
  status: "ACTIVE" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
}

export interface F5Mission {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  status: "OPEN" | "RUNNING" | "COMPLETED";
  progress: number;
  actions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface F5Briefing {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  summary: string;
  priorities: string[];
  opportunities: string[];
  risks: string[];
  createdAt: string;
}

export interface F5Activity {
  id: string;
  tenantId: string;
  source: string;
  type: string;
  title: string;
  severity: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
  createdAt: string;
}

export interface F5DigitalEmployee {
  id: string;
  tenantId: string;
  employeeType:
    | "SALES"
    | "FINANCE"
    | "MARKETING"
    | "INVENTORY"
    | "CEO_ADVISOR";
  name: string;
  status: "ACTIVE" | "PAUSED";
  assignedTasks: number;
  completedTasks: number;
  createdAt: string;
  updatedAt: string;
}