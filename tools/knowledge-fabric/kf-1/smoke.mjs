import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const knowledgeRoot = path.join(
  root,
  "apps",
  "api",
  "src",
  "knowledge-fabric",
);

const controller = fs.readFileSync(
  path.join(knowledgeRoot, "knowledge-fabric.controller.ts"),
  "utf8",
);
const graph = fs.readFileSync(
  path.join(knowledgeRoot, "knowledge-graph.service.ts"),
  "utf8",
);
const types = fs.readFileSync(
  path.join(knowledgeRoot, "knowledge.types.ts"),
  "utf8",
);

const checks = {
  statusRoute: controller.includes('@Get("status")'),
  healthRoute: controller.includes('@Get("health")'),
  registerRoute: controller.includes('@Post("knowledge")'),
  activateRoute: controller.includes('@Post("knowledge/:id/activate")'),
  relationRoute: controller.includes('@Post("relations")'),
  dependencyTraversal: graph.includes("dependenciesOf(knowledgeId: string)"),
  dependentTraversal: graph.includes("dependentsOf(knowledgeId: string)"),
  knowledgeDNA: types.includes("export interface KnowledgeDNA"),
  metadataFoundation: types.includes("export interface KnowledgeMetadata"),
  versioningFoundation: types.includes("export interface KnowledgeVersion"),
  classificationFoundation: types.includes("KnowledgeClassification"),
  provenanceFoundation: types.includes("provenanceScore"),
};

const failed = Object.entries(checks)
  .filter(([, passed]) => !passed)
  .map(([name]) => name);

if (failed.length) {
  throw new Error(`KF-1 smoke checks failed: ${failed.join(", ")}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Knowledge Fabric",
      pack: "KF-1 Knowledge Foundation",
      smokeTest: "passed",
      checks,
      checkCount: Object.keys(checks).length,
      nextPack: "KF-2 Knowledge Runtime",
    },
    null,
    2,
  ),
);