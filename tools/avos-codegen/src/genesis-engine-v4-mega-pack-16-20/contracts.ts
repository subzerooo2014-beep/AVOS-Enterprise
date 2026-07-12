export type V4FrontendPrimitive = string | number | boolean | null;
export type V4FrontendValue =
  | V4FrontendPrimitive
  | V4FrontendValue[]
  | { [key: string]: V4FrontendValue };

export enum V4FrontendStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V4FrontendField {
  name: string;
  type: "string" | "number" | "boolean" | "date";
  required: boolean;
  unique?: boolean;
}

export interface V4FrontendDomain {
  key: string;
  entityName: string;
  fields: V4FrontendField[];
}

export interface V4FrontendInput {
  systemKey: string;
  systemName: string;
  domains: V4FrontendDomain[];
  enableRbac?: boolean;
  enableDashboard?: boolean;
  enableSearch?: boolean;
  enableResponsiveShell?: boolean;
}

export interface V4FrontendArtifact {
  relativePath: string;
  kind:
    | "shell"
    | "dashboard"
    | "page"
    | "form"
    | "table"
    | "api-client"
    | "rbac"
    | "state"
    | "test"
    | "config"
    | "index";
  content: string;
  metadata: Record<string, V4FrontendValue>;
}
