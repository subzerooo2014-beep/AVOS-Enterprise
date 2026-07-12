import { readFile } from "node:fs/promises";
import path from "node:path";
import { GenesisCliSpecification } from "./contracts";

export class GenesisSpecificationLoader {
  async load(filePath: string): Promise<GenesisCliSpecification> {
    const absolutePath = path.resolve(filePath);
    const raw = await readFile(absolutePath, "utf8");
    const normalized = raw.replace(/^\uFEFF/, "");
    const parsed: unknown = JSON.parse(normalized);

    this.assertSpecification(parsed);
    return parsed;
  }

  private assertSpecification(
    value: unknown,
  ): asserts value is GenesisCliSpecification {
    if (!value || typeof value !== "object") {
      throw new Error("Genesis specification must be a JSON object.");
    }

    const spec = value as Record<string, unknown>;

    if (spec.mode !== "dry-run" && spec.mode !== "apply") {
      throw new Error(
        'Genesis specification mode must be "dry-run" or "apply".',
      );
    }

    if (!spec.pipeline || typeof spec.pipeline !== "object") {
      throw new Error("Genesis specification pipeline is required.");
    }

    const pipeline = spec.pipeline as Record<string, unknown>;

    if (!pipeline.intent || typeof pipeline.intent !== "object") {
      throw new Error("Genesis pipeline intent is required.");
    }

    const intent = pipeline.intent as Record<string, unknown>;

    if (
      typeof intent.systemKey !== "string" ||
      intent.systemKey.trim().length === 0
    ) {
      throw new Error("Genesis intent systemKey is required.");
    }

    if (
      typeof intent.name !== "string" ||
      intent.name.trim().length === 0
    ) {
      throw new Error("Genesis intent name is required.");
    }

    if (!Array.isArray(intent.domains) || intent.domains.length === 0) {
      throw new Error("Genesis intent requires at least one domain.");
    }

    if (
      typeof pipeline.outputDirectory !== "string" ||
      pipeline.outputDirectory.trim().length === 0
    ) {
      throw new Error("Genesis pipeline outputDirectory is required.");
    }

    if (!Array.isArray(pipeline.validationGates)) {
      throw new Error("Genesis validationGates must be an array.");
    }

    if (typeof pipeline.currentVersion !== "string") {
      throw new Error("Genesis currentVersion is required.");
    }

    if (
      pipeline.versionBump !== "major" &&
      pipeline.versionBump !== "minor" &&
      pipeline.versionBump !== "patch"
    ) {
      throw new Error(
        'Genesis versionBump must be "major", "minor", or "patch".',
      );
    }
  }
}
