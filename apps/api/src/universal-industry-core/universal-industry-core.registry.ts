import { UniversalIndustryCapability } from "./universal-industry-core.types";

export const UNIVERSAL_INDUSTRY_CAPABILITIES: Record<
  UniversalIndustryCapability,
  { name: string; category: string }
> = {
  INDUSTRY_ENGINE: { name: "Universal Industry Engine", category: "CORE" },
  INDUSTRY_REGISTRY: { name: "Industry Registry", category: "CORE" },
  INDUSTRY_RUNTIME: { name: "Industry Runtime", category: "CORE" },
  WORKFLOW_ENGINE: { name: "Industry Workflow Engine", category: "OPERATIONS" },
  AI_INTELLIGENCE: { name: "Industry AI Intelligence Engine", category: "AI" },
  ASSET_ENGINE: { name: "Industry Asset Engine", category: "ASSET" },
  FINANCE_ENGINE: { name: "Industry Finance Engine", category: "FINANCE" },
  COMPLIANCE_ENGINE: { name: "Industry Compliance Engine", category: "GOVERNANCE" },
  RISK_ENGINE: { name: "Industry Risk Engine", category: "RISK" },
  ANALYTICS_ENGINE: { name: "Industry Analytics Engine", category: "ANALYTICS" },
  COMMAND_CENTER: { name: "Industry Command Center", category: "CONTROL" },
  DASHBOARD_ENGINE: { name: "Industry Dashboard Engine", category: "EXPERIENCE" },
  NOTIFICATION_ENGINE: { name: "Industry Notification Engine", category: "COMMUNICATION" },
  AUTOMATION_ENGINE: { name: "Industry Automation Engine", category: "AUTOMATION" },
  REPORT_ENGINE: { name: "Industry Report Engine", category: "REPORTING" },
  KPI_ENGINE: { name: "Industry KPI Engine", category: "PERFORMANCE" },
  DOCUMENT_ENGINE: { name: "Industry Document Engine", category: "DOCUMENTS" },
  INTEGRATION_ENGINE: { name: "Industry Integration Engine", category: "INTEGRATION" },
  PLUGIN_SDK: { name: "Industry Plugin SDK", category: "DEVELOPER" },
  TEMPLATE_ENGINE: { name: "Industry Template Engine", category: "TEMPLATE" },
};

export const UNIVERSAL_INDUSTRY_CORE_VERSION = "1.0.0";