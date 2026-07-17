import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "apps/api/src/knowledge-fabric/exchange");
const files = [
  "knowledge-exchange.types.ts",
  "knowledge-exchange.contracts.ts",
  "knowledge-exchange-registry.service.ts",
  "knowledge-exchange-routing.service.ts",
  "knowledge-exchange-contract.service.ts",
  "knowledge-exchange-consistency.service.ts",
  "knowledge-exchange-event.service.ts",
  "knowledge-exchange-observability.service.ts",
  "knowledge-exchange-runtime.service.ts",
  "knowledge-exchange-health.service.ts",
  "knowledge-exchange.controller.ts",
  "knowledge-exchange.module.ts",
  "index.ts",
];
const missing = files.filter((file) => !fs.existsSync(path.join(base, file)));
const moduleText = fs.readFileSync(path.join(root, "apps/api/src/knowledge-fabric/knowledge-fabric.module.ts"), "utf8");
const indexText = fs.readFileSync(path.join(root, "apps/api/src/knowledge-fabric/index.ts"), "utf8");
const report = {
  success: missing.length === 0 && moduleText.includes("KnowledgeExchangeModule") && indexText.includes('./exchange'),
  system: "AVOS Knowledge Fabric",
  pack: "KF-9 Knowledge Exchange",
  verification: missing.length === 0 ? "passed" : "failed",
  filesVerified: files.length,
  missing,
  moduleRegistered: moduleText.includes("KnowledgeExchangeModule"),
  indexRegistered: indexText.includes('./exchange'),
  rollbackReady: fs.existsSync(path.join(root, "tools/knowledge-fabric/kf-9/rollback.ps1")),
};
console.log(JSON.stringify(report, null, 2));
if (!report.success) process.exit(1);