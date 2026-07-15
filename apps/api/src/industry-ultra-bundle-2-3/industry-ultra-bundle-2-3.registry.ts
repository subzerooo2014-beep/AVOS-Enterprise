import {
  UltraIndustryCapability,
  UltraIndustryCode,
} from "./industry-ultra-bundle-2-3.types";

const sharedCapabilities: UltraIndustryCapability[] = [
  "CORE_OPERATIONS",
  "ASSET_MANAGEMENT",
  "CUSTOMER_CITIZEN_360",
  "WORKFORCE",
  "SUPPLY_CHAIN",
  "FINANCE_REVENUE",
  "COMPLIANCE",
  "RISK",
  "AI_INTELLIGENCE",
  "AUTOMATION",
  "MARKETPLACE_ECOSYSTEM",
  "ANALYTICS",
  "DOCUMENTS",
  "NOTIFICATIONS",
  "COMMAND_CENTER",
];

export const INDUSTRY_ULTRA_REGISTRY: Record<
  UltraIndustryCode,
  { name: string; capabilities: UltraIndustryCapability[] }
> = {
  ENERGY_UTILITIES: {
    name: "Energy & Utilities Industry Pack",
    capabilities: [...sharedCapabilities],
  },
  RETAIL_COMMERCE: {
    name: "Retail & Commerce Industry Pack",
    capabilities: [...sharedCapabilities],
  },
  HOSPITALITY_TOURISM: {
    name: "Hospitality & Tourism Industry Pack",
    capabilities: [...sharedCapabilities],
  },
  EDUCATION: {
    name: "Education Industry Pack",
    capabilities: [...sharedCapabilities],
  },
  GOVERNMENT_PUBLIC_SECTOR: {
    name: "Government & Public Sector Industry Pack",
    capabilities: [...sharedCapabilities],
  },
  BANKING_FINTECH: {
    name: "Banking & FinTech Industry Pack",
    capabilities: [...sharedCapabilities],
  },
  INSURANCE: {
    name: "Insurance Industry Pack",
    capabilities: [...sharedCapabilities],
  },
  TELECOMMUNICATIONS: {
    name: "Telecommunications Industry Pack",
    capabilities: [...sharedCapabilities],
  },
  AVIATION: {
    name: "Aviation Industry Pack",
    capabilities: [...sharedCapabilities],
  },
  MARITIME: {
    name: "Maritime Industry Pack",
    capabilities: [...sharedCapabilities],
  },
};