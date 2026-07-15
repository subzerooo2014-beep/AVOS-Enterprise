import { GlobalPlatformCapability } from "./global-enterprise-platform.types";

export const GLOBAL_PLATFORM_CAPABILITIES: Record<
  GlobalPlatformCapability,
  { name: string; description: string }
> = {
  TENANT_FEDERATION: {
    name: "Enterprise Tenant Federation",
    description: "Cross-tenant organization, federation, and governance.",
  },
  MASTER_DATA_HUB: {
    name: "Cross-Industry Master Data Hub",
    description: "Canonical master data across industries and products.",
  },
  CUSTOMER_360: {
    name: "Universal Customer 360",
    description: "Unified customer profile and relationship intelligence.",
  },
  ASSET_REGISTRY: {
    name: "Universal Asset Registry",
    description: "Cross-industry asset identity and lifecycle registry.",
  },
  IDENTITY_ACCESS: {
    name: "Global Identity & Access",
    description: "Enterprise identity, roles, permissions, and access control.",
  },
  WORKFLOW_HUB: {
    name: "Enterprise Workflow Hub",
    description: "Shared enterprise workflows and orchestration.",
  },
  AI_ORCHESTRATOR: {
    name: "Cross-Industry AI Orchestrator",
    description: "AI coordination across all AVOS industry domains.",
  },
  NOTIFICATION_CENTER: {
    name: "Universal Notification Center",
    description: "Central notifications across channels and products.",
  },
  DOCUMENT_CENTER: {
    name: "Enterprise Document Center",
    description: "Central document metadata and lifecycle services.",
  },
  SEARCH_ENGINE: {
    name: "Universal Search Engine",
    description: "Global search across AVOS data and content.",
  },
  ANALYTICS_BI: {
    name: "Enterprise Analytics & BI",
    description: "Unified analytics and business intelligence.",
  },
  AUDIT_COMPLIANCE: {
    name: "Global Audit & Compliance",
    description: "Auditability, policy evidence, and compliance reporting.",
  },
  CROSS_INDUSTRY_REPORTING: {
    name: "Cross-Industry Reporting",
    description: "Standard reporting across all verticals.",
  },
  INTEGRATION_HUB: {
    name: "Enterprise Integration Hub",
    description: "Managed integration endpoints and adapters.",
  },
  PUBLIC_API_GATEWAY: {
    name: "Public API Gateway",
    description: "External API exposure and governance.",
  },
  EVENT_STREAMING: {
    name: "Enterprise Event Streaming",
    description: "Registered platform events and streaming flows.",
  },
  ENTERPRISE_SCHEDULER: {
    name: "Enterprise Scheduler",
    description: "Central scheduling and timed execution.",
  },
  AUTOMATION_CENTER: {
    name: "Automation Center",
    description: "Cross-platform business automation.",
  },
  CONFIGURATION_CENTER: {
    name: "Global Configuration Center",
    description: "Centralized configuration management.",
  },
  FEATURE_FLAGS: {
    name: "Feature Flag Center",
    description: "Controlled feature rollout and experimentation.",
  },
  PLUGIN_MARKETPLACE: {
    name: "Plugin Marketplace",
    description: "Managed extension and plugin ecosystem.",
  },
  LICENSE_SUBSCRIPTION: {
    name: "License & Subscription Center",
    description: "Product entitlement, plans, and licenses.",
  },
  BILLING_ORCHESTRATOR: {
    name: "Billing Orchestrator",
    description: "Cross-product billing coordination.",
  },
  MULTI_REGION_DEPLOYMENT: {
    name: "Multi-Region Deployment",
    description: "Regional deployment topology and controls.",
  },
  DISASTER_RECOVERY: {
    name: "Disaster Recovery",
    description: "Recovery planning, failover, and continuity.",
  },
  BACKUP_RESTORE: {
    name: "Backup & Restore",
    description: "Backup policies and restore operations.",
  },
  OBSERVABILITY: {
    name: "Monitoring & Observability",
    description: "Logs, metrics, traces, and operational insights.",
  },
  ENTERPRISE_HEALTH: {
    name: "Enterprise Health Center",
    description: "Consolidated platform health and readiness.",
  },
  AI_GOVERNANCE: {
    name: "AI Governance Center",
    description: "AI policy, evidence, safety, and explainability.",
  },
  ENTERPRISE_COMMAND_CENTER: {
    name: "Enterprise Command Center",
    description: "Executive control plane for the global platform.",
  },
};