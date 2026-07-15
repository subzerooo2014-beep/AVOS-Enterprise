export const UNIFIED_OPERATIONS_CAPABILITIES = [
  "cross-module-workflow-engine",
  "business-process-orchestrator",
  "approval-engine",
  "sla-engine",
  "escalation-engine",
  "event-automation",
  "scheduled-jobs",
  "rule-engine",
  "action-engine",
  "notification-automation",
  "crm-erp-integration",
  "erp-marketplace-integration",
  "marketplace-ai-integration",
  "ai-executive-integration",
  "executive-saas-integration",
  "shared-event-bus-integration",
  "lead-to-deal-template",
  "deal-to-invoice-template",
  "invoice-to-payment-template",
  "customer-to-loyalty-template",
  "order-to-logistics-template",
  "procurement-to-inventory-template",
  "hr-to-payroll-template",
  "project-to-billing-template",
  "live-operations-dashboard",
  "unified-kpis",
  "enterprise-alerts",
  "enterprise-health",
  "business-timeline",
  "ai-workflow-recommendations",
  "ai-process-optimization",
  "ai-bottleneck-detection",
  "ai-executive-insights",
  "ai-predictive-operations",
] as const;

export const PROCESS_TEMPLATES = [
  {
    key: "lead-to-deal",
    name: "Lead → Deal",
    steps: [
      { key: "lead-qualified", name: "Lead Qualified", module: "CRM", action: "qualify", requiresApproval: false, slaMinutes: 240 },
      { key: "opportunity-created", name: "Opportunity Created", module: "CRM", action: "create-opportunity", requiresApproval: false, slaMinutes: 60 },
      { key: "proposal-approved", name: "Proposal Approved", module: "GOVERNANCE", action: "approve-proposal", requiresApproval: true, slaMinutes: 480 },
      { key: "deal-created", name: "Deal Created", module: "MARKETPLACE", action: "create-deal", requiresApproval: false, slaMinutes: 60 },
    ],
  },
  {
    key: "deal-to-invoice",
    name: "Deal → Invoice",
    steps: [
      { key: "deal-confirmed", name: "Deal Confirmed", module: "MARKETPLACE", action: "confirm-deal", requiresApproval: false, slaMinutes: 60 },
      { key: "invoice-created", name: "Invoice Created", module: "ERP", action: "create-invoice", requiresApproval: false, slaMinutes: 60 },
    ],
  },
  {
    key: "invoice-to-payment",
    name: "Invoice → Payment",
    steps: [
      { key: "invoice-issued", name: "Invoice Issued", module: "ERP", action: "issue-invoice", requiresApproval: false, slaMinutes: 30 },
      { key: "payment-captured", name: "Payment Captured", module: "PAYMENTS", action: "capture-payment", requiresApproval: false, slaMinutes: 1440 },
    ],
  },
  {
    key: "customer-to-loyalty",
    name: "Customer → Loyalty",
    steps: [
      { key: "customer-active", name: "Customer Active", module: "CRM", action: "activate-customer", requiresApproval: false },
      { key: "loyalty-enrolled", name: "Loyalty Enrolled", module: "CRM", action: "enroll-loyalty", requiresApproval: false },
    ],
  },
  {
    key: "order-to-logistics",
    name: "Order → Logistics",
    steps: [
      { key: "order-paid", name: "Order Paid", module: "MARKETPLACE", action: "mark-paid", requiresApproval: false },
      { key: "shipment-created", name: "Shipment Created", module: "LOGISTICS", action: "create-shipment", requiresApproval: false },
      { key: "delivery-completed", name: "Delivery Completed", module: "LOGISTICS", action: "complete-delivery", requiresApproval: false },
    ],
  },
  {
    key: "procurement-to-inventory",
    name: "Procurement → Inventory",
    steps: [
      { key: "purchase-order-approved", name: "PO Approved", module: "ERP", action: "approve-po", requiresApproval: true },
      { key: "stock-received", name: "Stock Received", module: "ERP", action: "receive-stock", requiresApproval: false },
    ],
  },
  {
    key: "hr-to-payroll",
    name: "HR → Payroll",
    steps: [
      { key: "timesheet-approved", name: "Timesheet Approved", module: "ERP", action: "approve-timesheet", requiresApproval: true },
      { key: "payroll-generated", name: "Payroll Generated", module: "ERP", action: "generate-payroll", requiresApproval: false },
    ],
  },
  {
    key: "project-to-billing",
    name: "Project → Billing",
    steps: [
      { key: "milestone-completed", name: "Milestone Completed", module: "ERP", action: "complete-milestone", requiresApproval: false },
      { key: "billing-created", name: "Billing Created", module: "ERP", action: "create-billing", requiresApproval: false },
    ],
  },
] as const;