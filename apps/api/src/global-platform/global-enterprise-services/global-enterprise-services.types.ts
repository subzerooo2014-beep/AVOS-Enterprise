export type IdentityProviderType =
  | "OIDC"
  | "SAML"
  | "AZURE_AD"
  | "GOOGLE_WORKSPACE"
  | "CUSTOM";

export type AccessDecision = "ALLOW" | "DENY" | "REVIEW";

export interface GlobalIdentityProvider {
  id: string;
  tenantId: string;
  name: string;
  type: IdentityProviderType;
  issuer: string;
  clientId: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalOrganizationNode {
  id: string;
  tenantId: string;
  parentId?: string;
  name: string;
  type: "GROUP" | "COMPANY" | "BUSINESS_UNIT" | "BRANCH";
  countryCode: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalAccessContext {
  tenantId: string;
  subjectId: string;
  roles: string[];
  attributes: Record<string, string | number | boolean>;
  resource: string;
  action: string;
  countryCode?: string;
}

export interface GlobalAccessResult {
  decision: AccessDecision;
  reason: string;
  matchedRoles: string[];
  matchedAttributes: string[];
  evaluatedAt: string;
}

export interface GlobalPolicy {
  id: string;
  tenantId: string;
  name: string;
  countries: string[];
  requiredRoles: string[];
  requiredAttributes: Record<string, string | number | boolean>;
  effect: "ALLOW" | "DENY";
  enabled: boolean;
}

export interface GlobalEnterpriseSnapshot {
  system: "AVOS Global Platform";
  component: "Global Enterprise Services";
  identityProviders: number;
  organizationNodes: number;
  policies: number;
  enabledPolicies: number;
  globalEvents: number;
  governanceScore: number;
  status: "HEALTHY" | "DEGRADED";
  generatedAt: string;
}