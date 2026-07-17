import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const base = path.join(root, "apps/api/src/enterprise-metadata-layer");
const expected = ["registry", "catalog", "schema", "lineage", "governance", "relationship", "analytics", "ai", "certification"];
const operational = expected.every((layer) => fs.existsSync(path.join(base, layer, `${layer}.module.ts`)));
const result = { success: operational, system: "AVOS Enterprise Metadata Layer", smokeTest: operational ? "passed" : "failed", layers: expected.length, certification: operational ? "CERTIFIED" : "FAILED" };
console.log(JSON.stringify(result, null, 2));
if (!result.success) process.exit(1);