import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "apps/api/src/knowledge-fabric/mesh");
const read = (file) => fs.readFileSync(path.join(base, file), "utf8");
const controller = read("knowledge-mesh.controller.ts");
const runtime = read("knowledge-mesh-runtime.service.ts");
const checks = {
  statusRoute: controller.includes('@Get("status")'),
  domainsRoute: controller.includes('@Get("domains")'),
  nodesRoute: controller.includes('@Get("nodes")'),
  registerDomainRoute: controller.includes('@Post("domains")'),
  registerNodeRoute: controller.includes('@Post("nodes")'),
  routesRoute: controller.includes('@Post("routes")'),
  policiesRoute: controller.includes('@Post("policies")'),
  executeRoute: controller.includes('@Post("execute")'),
  registry: runtime.includes("KnowledgeMeshRegistryService"),
  routing: runtime.includes("KnowledgeMeshRoutingService"),
  policy: runtime.includes("KnowledgeMeshPolicyService"),
  consistency: runtime.includes("KnowledgeMeshConsistencyService"),
  observability: runtime.includes("KnowledgeMeshObservabilityService"),
  event: runtime.includes("knowledge.mesh.request.completed"),
};
const success = Object.values(checks).every(Boolean);
console.log(JSON.stringify({
  success,
  system: "AVOS Knowledge Fabric",
  pack: "KF-8 Knowledge Mesh",
  smokeTest: success ? "passed" : "failed",
  checks,
  checkCount: Object.keys(checks).length,
  nextPack: "KF-9 Knowledge Exchange",
}, null, 2));
if (!success) process.exit(1);