import { ProductDomainDefinition } from "./grand-business-product.types";

export const GRAND_BUSINESS_DOMAINS: ProductDomainDefinition[] = [
  {
    key: "vehicle-marketplace",
    name: "Vehicle Marketplace",
    capabilities: ["listings", "search", "compare", "favorites", "offers", "deals", "media", "trust"],
    enabled: true,
  },
  {
    key: "auction-platform",
    name: "Auction Platform",
    capabilities: ["scheduled-auctions", "live-auctions", "auto-bid", "deposits", "extensions", "settlement", "winner-flow", "audit"],
    enabled: true,
  },
  {
    key: "finance-insurance",
    name: "Finance & Insurance",
    capabilities: ["finance-requests", "pre-approval", "bank-offers", "installments", "insurance-quotes", "policies", "claims", "renewals"],
    enabled: true,
  },
  {
    key: "export-logistics",
    name: "Export & Logistics",
    capabilities: ["export-only", "shipping-quotes", "customs", "documents", "tracking", "carriers", "ports", "delivery"],
    enabled: true,
  },
  {
    key: "dealer-workshop",
    name: "Dealer & Workshop Suite",
    capabilities: ["dealer-inventory", "crm-leads", "quotes", "contracts", "bookings", "jobs", "parts", "warranty"],
    enabled: true,
  },
  {
    key: "parts-accessories",
    name: "Parts & Accessories Commerce",
    capabilities: ["catalog", "fitment", "suppliers", "stock", "orders", "returns", "bundles", "recommendations"],
    enabled: true,
  },
  {
    key: "customer-growth",
    name: "Customer Growth Platform",
    capabilities: ["customer-360", "journeys", "campaigns", "notifications", "referrals", "loyalty", "reviews", "recommendations"],
    enabled: true,
  },
  {
    key: "revenue-operations",
    name: "Revenue Operations",
    capabilities: ["subscriptions", "billing", "payments", "commissions", "ads", "coupons", "refunds", "analytics"],
    enabled: true,
  },
  {
    key: "partner-network",
    name: "Partner Network",
    capabilities: ["onboarding", "verification", "agreements", "sla", "performance", "settlements", "webhooks", "marketplace"],
    enabled: true,
  },
  {
    key: "business-command-center",
    name: "Business Command Center",
    capabilities: ["kpis", "revenue", "growth", "risk", "operations", "alerts", "approvals", "forecast"],
    enabled: true,
  }
];