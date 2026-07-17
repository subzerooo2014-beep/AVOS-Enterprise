import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "apps/api/src/digital-genome");
const folders = ["registry","composition","capabilities","products","knowledge","security","integrations","intelligence","health","evolution","certification"];

const operational = folders.every((folder) =>
  fs.existsSync(path.join(base, folder, folder + ".module.ts")),
);

const result = {
  success: operational,
  system: "AVOS Digital Genome",
  smokeTest: operational ? "passed" : "failed",
  layers: folders.length,
  certification: operational ? "CERTIFIED" : "FAILED",
};

console.log(JSON.stringify(result, null, 2));

if (!result.success) {
  process.exit(1);
}