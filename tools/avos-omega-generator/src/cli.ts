import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { OmegaGenerator } from "./omega-generator";
import { OmegaBundleBlueprint } from "./omega-generator.types";

const blueprintPath = process.argv[2];

if (!blueprintPath) {
  throw new Error(
    "Usage: node dist/cli.js <blueprint.json>",
  );
}

const absolutePath = resolve(blueprintPath);
const blueprint = JSON.parse(
  readFileSync(absolutePath, "utf8"),
) as OmegaBundleBlueprint;

const generator = new OmegaGenerator();
const result = generator.generate(blueprint);

process.stdout.write(
  `${JSON.stringify(result, null, 2)}\n`,
);