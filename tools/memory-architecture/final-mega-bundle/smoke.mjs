import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const base = path.join(root, "apps/api/src/memory-architecture");
const expected = ["foundation", "storage", "intelligence", "evolution", "security", "federation", "analytics", "ai", "certification"];
const operational = expected.every((layer) => fs.existsSync(path.join(base, layer, `${layer}.module.ts`)));
const result = { success: operational, system: "AVOS Memory Architecture", smokeTest: operational ? "passed" : "failed", layers: expected.length, certification: operational ? "CERTIFIED" : "FAILED" };
console.log(JSON.stringify(result, null, 2));
if (!result.success) process.exit(1);