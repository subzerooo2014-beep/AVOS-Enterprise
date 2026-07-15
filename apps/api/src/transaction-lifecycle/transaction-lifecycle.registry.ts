import { TransactionDomainDefinition } from "./transaction-lifecycle.types";

export const TRANSACTION_LIFECYCLE_DOMAINS: TransactionDomainDefinition[] = [
  {
    key: "reservation-engine",
    name: "Reservation Engine",
    capabilities: ["holds", "deposits", "expiry", "availability", "buyer-lock", "seller-confirmation", "cancellation", "audit"],
    enabled: true,
  },
  {
    key: "identity-kyc",
    name: "Identity & KYC",
    capabilities: ["identity-check", "document-check", "liveness", "sanctions", "pep", "risk-score", "consent", "audit"],
    enabled: true,
  },
  {
    key: "inspection-certification",
    name: "Inspection & Certification",
    capabilities: ["booking", "checklist", "media", "diagnostics", "grading", "certificate", "reinspection", "audit"],
    enabled: true,
  },
  {
    key: "contracting-esign",
    name: "Contracting & E-Sign",
    capabilities: ["templates", "clauses", "offers", "acceptance", "esign", "versioning", "witness", "audit"],
    enabled: true,
  },
  {
    key: "escrow-settlement",
    name: "Escrow & Settlement",
    capabilities: ["funding", "holds", "release", "split", "fees", "refund", "reconciliation", "audit"],
    enabled: true,
  },
  {
    key: "ownership-transfer",
    name: "Ownership Transfer",
    capabilities: ["eligibility", "documents", "fees", "government-submit", "status", "approval", "handover", "audit"],
    enabled: true,
  },
  {
    key: "delivery-handover",
    name: "Delivery & Handover",
    capabilities: ["pickup", "delivery", "tracking", "handover-checklist", "signature", "proof", "exceptions", "audit"],
    enabled: true,
  },
  {
    key: "digital-vehicle-passport",
    name: "Digital Vehicle Passport",
    capabilities: ["identity", "history", "inspection", "ownership", "service", "insurance", "export", "audit"],
    enabled: true,
  },
  {
    key: "dispute-resolution",
    name: "Dispute Resolution",
    capabilities: ["case-open", "evidence", "mediation", "decision", "refund", "appeal", "sla", "audit"],
    enabled: true,
  },
  {
    key: "after-sales-care",
    name: "After-Sales Care",
    capabilities: ["warranty", "service-plan", "reminders", "support", "claims", "retention", "feedback", "audit"],
    enabled: true,
  },
  {
    key: "trade-in-engine",
    name: "Trade-In Engine",
    capabilities: ["valuation", "condition", "offer", "balance", "settlement", "inventory", "handover", "audit"],
    enabled: true,
  },
  {
    key: "transaction-command-center",
    name: "Transaction Command Center",
    capabilities: ["pipeline", "risk", "approvals", "revenue", "exceptions", "sla", "alerts", "forecast"],
    enabled: true,
  }
];