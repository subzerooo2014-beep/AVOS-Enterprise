import { EnterpriseFederationPlatformCapability } from "./enterprise-federation-platform.types";

export const ENTERPRISE_FEDERATION_PLATFORM_CAPABILITIES: Readonly<Record<EnterpriseFederationPlatformCapability, string>> = {
  TENANT_FEDERATION: "Tenant Federation",
  ORGANIZATION_FEDERATION: "Organization Federation",
  IDENTITY_FEDERATION: "Identity Federation",
  TRUST_FEDERATION: "Trust Federation",
  SHARED_ENTERPRISE_SERVICES: "Shared Enterprise Services",
  FEDERATED_POLICY: "Federated Policy",
  FEDERATED_DATA_ACCESS: "Federated Data Access",
  CROSS_ORG_WORKFLOWS: "Cross Org Workflows",
  FEDERATION_AUDIT: "Federation Audit",
  FEDERATION_CONTROL_PLANE: "Federation Control Plane",
};