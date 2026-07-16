export type EnterpriseFederationPlatformCapability =
  | "TENANT_FEDERATION"
  | "ORGANIZATION_FEDERATION"
  | "IDENTITY_FEDERATION"
  | "TRUST_FEDERATION"
  | "SHARED_ENTERPRISE_SERVICES"
  | "FEDERATED_POLICY"
  | "FEDERATED_DATA_ACCESS"
  | "CROSS_ORG_WORKFLOWS"
  | "FEDERATION_AUDIT"
  | "FEDERATION_CONTROL_PLANE";

export interface EnterpriseFederationPlatformRecord {
  id: string;
  capability: EnterpriseFederationPlatformCapability;
  status: "READY" | "ACTIVE" | "COMPLETED";
  createdAt: string;
  metadata?: Record<string, unknown>;
}