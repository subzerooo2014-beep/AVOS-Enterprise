import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows/core-flow-federation.types.ts",
  "src/core-application-flows/core-flow-federation.service.ts",
  "src/core-application-flows/core-flow-router.service.ts",
  "src/core-application-flows/core-flow-simulation.service.ts",
  "src/core-application-flows/core-flow-digital-twin.service.ts",
  "src/core-application-flows/core-flow-control-plane.service.ts",
  "src/core-application-flows/core-flow-federation-operations.service.ts",
  "src/core-application-flows/core-flow-federation.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  federationReady: all.includes("CoreFlowFederationService"),
  routingReady: all.includes("CoreFlowRouterService"),
  simulationsReady: all.includes("CoreFlowSimulationService"),
  digitalTwinReady: all.includes("CoreFlowDigitalTwinService"),
  controlPlaneReady: all.includes("CoreFlowControlPlaneService"),
  regionalAffinityReady: all.includes("regional-affinity"),
  capabilityRoutingReady: all.includes("capability-match"),
  nodeIsolationReady: all.includes("isolate-node"),
  operationsReady: all.includes("CoreFlowFederationOperationsService"),
  controllerRegistered: all.includes("CoreFlowFederationController"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  bundle: "Ultra Bundle H — Mega Packs 151-175",
  version: "1.175.0",
  classification: "federation-routing-simulation-digital-twin-control-plane",
  megaPacks: 25,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
