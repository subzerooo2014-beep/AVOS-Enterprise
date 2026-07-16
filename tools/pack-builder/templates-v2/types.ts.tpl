export type {{TYPE_NAME}} =
{{CAPABILITY_UNION}};

export interface {{RECORD_NAME}} {
  id: string;
  capability: {{TYPE_NAME}};
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}