import { ProductCapability } from "./enterprise-product-suites.types";

export const ENTERPRISE_PRODUCT_CAPABILITIES: ProductCapability[] = [
  { key: "customer-360", name: "Customer 360", suite: "CRM", reusable: true, multiIndustry: true, active: true },
  { key: "sales-crm", name: "Sales CRM", suite: "CRM", reusable: true, multiIndustry: true, active: true },
  { key: "service-crm", name: "Service CRM", suite: "CRM", reusable: true, multiIndustry: true, active: true },
  { key: "marketing-crm", name: "Marketing CRM", suite: "CRM", reusable: true, multiIndustry: true, active: true },
  { key: "loyalty-crm", name: "Loyalty", suite: "CRM", reusable: true, multiIndustry: true, active: true },
  { key: "customer-success", name: "Customer Success", suite: "CRM", reusable: true, multiIndustry: true, active: true },

  { key: "finance-erp", name: "Finance", suite: "ERP", reusable: true, multiIndustry: true, active: true },
  { key: "procurement-erp", name: "Procurement", suite: "ERP", reusable: true, multiIndustry: true, active: true },
  { key: "inventory-erp", name: "Inventory", suite: "ERP", reusable: true, multiIndustry: true, active: true },
  { key: "warehouse-erp", name: "Warehouse", suite: "ERP", reusable: true, multiIndustry: true, active: true },
  { key: "hr-erp", name: "HR", suite: "ERP", reusable: true, multiIndustry: true, active: true },
  { key: "projects-erp", name: "Projects", suite: "ERP", reusable: true, multiIndustry: true, active: true },

  { key: "dealer-portal", name: "Dealer Portal", suite: "MARKETPLACE", reusable: true, multiIndustry: true, active: true },
  { key: "seller-portal", name: "Seller Portal", suite: "MARKETPLACE", reusable: true, multiIndustry: true, active: true },
  { key: "buyer-portal", name: "Buyer Portal", suite: "MARKETPLACE", reusable: true, multiIndustry: true, active: true },
  { key: "auctions-product", name: "Auctions", suite: "MARKETPLACE", reusable: true, multiIndustry: true, active: true },
  { key: "export-product", name: "Export", suite: "MARKETPLACE", reusable: true, multiIndustry: true, active: true },
  { key: "logistics-product", name: "Logistics", suite: "MARKETPLACE", reusable: true, multiIndustry: true, active: true },

  { key: "executive-ai-product", name: "Executive AI", suite: "AI_ENTERPRISE", reusable: true, multiIndustry: true, active: true },
  { key: "sales-ai-product", name: "Sales AI", suite: "AI_ENTERPRISE", reusable: true, multiIndustry: true, active: true },
  { key: "marketing-ai-product", name: "Marketing AI", suite: "AI_ENTERPRISE", reusable: true, multiIndustry: true, active: true },
  { key: "finance-ai-product", name: "Finance AI", suite: "AI_ENTERPRISE", reusable: true, multiIndustry: true, active: true },
  { key: "support-ai-product", name: "Support AI", suite: "AI_ENTERPRISE", reusable: true, multiIndustry: true, active: true },
  { key: "operations-ai-product", name: "Operations AI", suite: "AI_ENTERPRISE", reusable: true, multiIndustry: true, active: true },

  { key: "automotive-pack", name: "Automotive", suite: "INDUSTRY_PACKS", reusable: false, multiIndustry: false, active: true },
  { key: "heavy-equipment-pack", name: "Heavy Equipment", suite: "INDUSTRY_PACKS", reusable: false, multiIndustry: false, active: true },
  { key: "marine-pack", name: "Marine", suite: "INDUSTRY_PACKS", reusable: false, multiIndustry: false, active: true },
  { key: "aviation-pack", name: "Aviation", suite: "INDUSTRY_PACKS", reusable: false, multiIndustry: false, active: true },
  { key: "camping-caravans-pack", name: "Camping & Caravans", suite: "INDUSTRY_PACKS", reusable: false, multiIndustry: false, active: true },
  { key: "motorcycles-pack", name: "Motorcycles", suite: "INDUSTRY_PACKS", reusable: false, multiIndustry: false, active: true },
  { key: "trucks-buses-pack", name: "Trucks & Buses", suite: "INDUSTRY_PACKS", reusable: false, multiIndustry: false, active: true },

  { key: "multi-tenant-saas", name: "Multi-Tenant SaaS", suite: "GLOBAL_SAAS", reusable: true, multiIndustry: true, active: true },
  { key: "subscription-billing", name: "Subscription Billing", suite: "GLOBAL_SAAS", reusable: true, multiIndustry: true, active: true },
  { key: "white-label", name: "White Label", suite: "GLOBAL_SAAS", reusable: true, multiIndustry: true, active: true },
  { key: "partner-marketplace", name: "Marketplace for Partners", suite: "GLOBAL_SAAS", reusable: true, multiIndustry: true, active: true },
  { key: "app-store", name: "App Store", suite: "GLOBAL_SAAS", reusable: true, multiIndustry: true, active: true },
  { key: "enterprise-apis", name: "Enterprise APIs", suite: "GLOBAL_SAAS", reusable: true, multiIndustry: true, active: true },
];