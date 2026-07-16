export type {{TYPE_NAME}} =
{{CAPABILITY_UNION}};

export interface {{RECORD_NAME}} {
  id: string;
  tenantId: string;
  capability: {{TYPE_NAME}};
  name: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "FAILED";
  score: number;
  metadata: Record<string, string | number | boolean>;
  createdAt: string;
  updatedAt: string;
}