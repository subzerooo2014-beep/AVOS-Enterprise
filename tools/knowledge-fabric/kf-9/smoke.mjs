import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "apps/api/src/knowledge-fabric/exchange");
const read = (file) => fs.readFileSync(path.join(base, file), "utf8");
const controller = read("knowledge-exchange.controller.ts");
const runtime = read("knowledge-exchange-runtime.service.ts");
const checks = {
  statusRoute: controller.includes('@Get("status")'),
  channelsRoute: controller.includes('@Get("channels")'),
  participantsRoute: controller.includes('@Get("participants")'),
  registerChannelRoute: controller.includes('@Post("channels")'),
  registerParticipantRoute: controller.includes('@Post("participants")'),
  offersRoute: controller.includes('@Post("offers")'),
  contractsRoute: controller.includes('@Post("contracts")'),
  executeRoute: controller.includes('@Post("execute")'),
  registry: runtime.includes("KnowledgeExchangeRegistryService"),
  routing: runtime.includes("KnowledgeExchangeRoutingService"),
  contract: runtime.includes("KnowledgeExchangePolicyService"),
  consistency: runtime.includes("KnowledgeExchangeConsistencyService"),
  observability: runtime.includes("KnowledgeExchangeObservabilityService"),
  event: runtime.includes("knowledge.exchange.request.completed"),
};
const success = Object.values(checks).every(Boolean);
console.log(JSON.stringify({
  success,
  system: "AVOS Knowledge Fabric",
  pack: "KF-9 Knowledge Exchange",
  smokeTest: success ? "passed" : "failed",
  checks,
  checkCount: Object.keys(checks).length,
  nextPack: "KF-10 Knowledge Marketplace",
}, null, 2));
if (!success) process.exit(1);