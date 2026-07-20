export type StudioItemStatus =
  | "draft"
  | "pending-approval"
  | "approved"
  | "active"
  | "paused"
  | "completed"
  | "rejected";

export interface StudioContext {
  tenantId: string;
  userId: string;
  workspaceId?: string;
  roles?: string[];
  permissions?: string[];
}

export interface StudioRecord {
  id: string;
  sectionId: string;
  tenantId: string;
  workspaceId?: string;
  title: string;
  description?: string;
  status: StudioItemStatus;
  data: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioSectionDefinition {
  id: string;
  name: string;
  category: "section" | "shared" | "foundation" | "production";
  route: string;
  enabled: boolean;
  requiresHumanApproval: boolean;
  permissions: string[];
  capabilities: string[];
}

export interface StudioWorkspace {
  id: string;
  tenantId: string;
  name: string;
  productIds: string[];
  memberIds: string[];
  layoutId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioDashboard {
  id: string;
  tenantId: string;
  workspaceId: string;
  name: string;
  widgets: string[];
  kpis: Record<string, number>;
  generatedAt: string;
}

export interface StudioCommand {
  id: string;
  tenantId: string;
  userId: string;
  command: string;
  parameters: Record<string, unknown>;
  status: "received" | "planned" | "pending-approval" | "executed" | "rejected";
  result?: Record<string, unknown>;
  generatedAt: string;
}

export interface StudioApproval {
  id: string;
  tenantId: string;
  subjectType: string;
  subjectId: string;
  decision: "approved" | "rejected";
  decidedBy: string;
  reason?: string;
  decidedAt: string;
}