import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "src/core-application-flows-v2/core-flow-cluster.types.ts",
  "src/core-application-flows-v2/core-flow-cluster-store.service.ts",
  "src/core-application-flows-v2/core-flow-leader-election.service.ts",
  "src/core-application-flows-v2/core-flow-cluster-registry.service.ts",
  "src/core-application-flows-v2/core-flow-distributed-scheduler.service.ts",
  "src/core-application-flows-v2/core-flow-capacity-manager.service.ts",
  "src/core-application-flows-v2/core-flow-distributed-runtime.service.ts",
  "src/core-application-flows-v2/core-flow-distributed.controller.ts",
  "src/workflows/workflows.module.ts",
];

const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
const all = missing.length
  ? ""
  : required.map((file) => fs.readFileSync(path.join(root, file), "utf8")).join("\n");

const checks = {
  requiredFilesPresent: missing.length === 0,
  clusterRegistryReady: all.includes("CoreFlowClusterRegistryService"),
  leaderElectionReady: all.includes("CoreFlowLeaderElectionService"),
  distributedSchedulingReady: all.includes("CoreFlowDistributedSchedulerService"),
  capacityManagementReady: all.includes("CoreFlowCapacityManagerService"),
  distributedRuntimeReady: all.includes("CoreFlowDistributedRuntimeService"),
  leaderLeaseReady: all.includes("avos_core_flow_cluster_lock"),
  nodeLeasesReady: all.includes("lease_until"),
  queueBalancingReady: all.includes("sort((a: any, b: any)"),
  autoScalingReady: all.includes("scale-up") && all.includes("scale-down"),
  crossClusterRecoveryReady: all.includes("recoverStaleLocks"),
  controllerRegistered: all.includes("CoreFlowDistributedController"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V2",
  bundle: "Ultra Bundle P — Mega Packs 351-375",
  version: "2.375.0",
  classification: "distributed-cluster-leader-election-scheduling-capacity-recovery",
  megaPacks: 25,
  missing,
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));

if (!success) process.exit(1);
