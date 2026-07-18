import { Injectable } from "@nestjs/common";
import {
  mkdirSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";
import { createHash, randomUUID } from "node:crypto";
import {
  CapabilityArtifact,
  CapabilityProductionBlueprint,
  CapabilityProductionRecord
} from "./capability-production-persistence.contracts";
import { CapabilityArtifactRepositoryService } from "./capability-artifact-repository.service";
import { CapabilityProductionPathsService } from "./capability-production-paths.service";
import { PersistentProductionRegistryService } from "./persistent-production-registry.service";

@Injectable()
export class GeneratedSourceMaterializerService {
  constructor(
    private readonly paths: CapabilityProductionPathsService,
    private readonly registry: PersistentProductionRegistryService,
    private readonly artifacts: CapabilityArtifactRepositoryService
  ) {}

  materialize(
    blueprint: CapabilityProductionBlueprint
  ): CapabilityProductionRecord {
    const humanFinalAuthority =
      blueprint.approvedBy.startsWith("human:");

    if (!humanFinalAuthority) {
      throw new Error("Human Final Authority approval is required.");
    }

    const slug = this.slug(blueprint.name);
    const workspacePath = this.paths.workspace(slug, blueprint.version);
    mkdirSync(workspacePath, { recursive: true });

    const generated = [
      this.write(
        workspacePath,
        "capability.blueprint.json",
        JSON.stringify(blueprint, null, 2),
        "blueprint"
      ),
      this.write(
        workspacePath,
        "README.md",
        [
          `# ${blueprint.name}`,
          "",
          blueprint.description,
          "",
          `Version: ${blueprint.version}`,
          `Domain: ${blueprint.domain}`,
          `Approved by: ${blueprint.approvedBy}`
        ].join("\n"),
        "documentation"
      )
    ];

    const now = new Date().toISOString();
    const record: CapabilityProductionRecord = {
      id: randomUUID(),
      blueprint,
      status: "registered",
      workspacePath,
      artifacts: generated,
      humanFinalAuthority,
      createdAt: now,
      updatedAt: now
    };

    this.registry.save(record);
    this.artifacts.register({
      runId: record.id,
      workspacePath,
      artifacts: generated
    });

    return record;
  }

  private write(
    workspacePath: string,
    relativePath: string,
    content: string,
    kind: string
  ): CapabilityArtifact {
    const target = join(workspacePath, relativePath);
    writeFileSync(target, content, "utf8");

    return {
      relativePath,
      kind,
      checksum: createHash("sha256").update(content).digest("hex"),
      size: Buffer.byteLength(content, "utf8")
    };
  }

  private slug(value: string): string {
    const result = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!result) {
      throw new Error("Blueprint name cannot produce an empty slug.");
    }

    return result;
  }
}
