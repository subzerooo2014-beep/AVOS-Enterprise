import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow.types.ts",
  "src/core-application-flows/core-flow.utils.ts",
  "src/quotes/quotes.service.ts",
  "src/orders/orders.service.ts",
  "src/invoices/invoices.service.ts",
  "src/payments/payments.service.ts",
  "src/reservations/reservations.service.ts",
  "src/workflows/workflows.service.ts",
  "src/events/events.service.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const all = missing.length ? "" : required.map(read).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  quoteToOrderReady: all.includes("quote-to-order"),
  orderToInvoiceReady: all.includes("order-to-invoice"),
  invoiceToPaymentReady: all.includes("invoice-to-payment"),
  refundReady: all.includes("payment-refund"),
  reservationLifecycleReady: all.includes("expireDue"),
  transactionsReady: all.includes("$transaction"),
  idempotencyReady: all.includes("resolveIdempotencyKey"),
  workflowRuntimeReady: all.includes("CoreWorkflowExecution"),
  eventJournalReady: all.includes("CoreFlowEvent"),
};

const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Mega Packs 1-5",
  version: "1.5.0",
  classification: "quote-order-invoice-payment-reservation-orchestration",
  requiredFiles: required.length,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
