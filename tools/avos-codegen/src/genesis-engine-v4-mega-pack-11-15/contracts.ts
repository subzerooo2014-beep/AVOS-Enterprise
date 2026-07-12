export type V4BackendPrimitive = string | number | boolean | null;
export type V4BackendValue =
  | V4BackendPrimitive
  | V4BackendValue[]
  | { [key: string]: V4BackendValue };

export enum V4BackendStatus {
  READY = "ready",
  DEGRADED = "degraded",
  BLOCKED = "blocked",
}

export interface V4BackendField {
  name: string;
  type: "string" | "number" | "boolean" | "date";
  required: boolean;
  unique?: boolean;
}

export interface V4BackendDomain {
  key: string;
  entityName: string;
  fields: V4BackendField[];
}

export interface V4BackendInput {
  systemKey: string;
  domains: V4BackendDomain[];
  enableRbac?: boolean;
  enableAudit?: boolean;
  enableEvents?: boolean;
  enableOpenApi?: boolean;
}

export interface V4BackendArtifact {
  relativePath: string;
  kind:
    | "module"
    | "controller"
    | "service"
    | "dto"
    | "repository"
    | "policy"
    | "event"
    | "exception"
    | "test"
    | "index";
  content: string;
  metadata: Record<string, V4BackendValue>;
}
