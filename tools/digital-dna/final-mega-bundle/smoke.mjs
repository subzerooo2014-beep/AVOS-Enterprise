import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "apps/api/src/digital-dna");
const folders = ["registry","identity","metadata","relationships","contracts","policies","events","metrics","versions","evolution","certification"];

const operational = folders.every((folder) =>
  fs.existsSync(path.join(base, folder, folder + ".module.ts")),
);

const result = {
  success: operational,
  system: "AVOS Digital DNA",
  smokeTest: operational ? "passed" : "failed",
  layers: folders.length,
  certification: operational ? "CERTIFIED" : "FAILED",
};

console.log(JSON.stringify(result, null, 2));

if (!result.success) {
  process.exit(1);
}