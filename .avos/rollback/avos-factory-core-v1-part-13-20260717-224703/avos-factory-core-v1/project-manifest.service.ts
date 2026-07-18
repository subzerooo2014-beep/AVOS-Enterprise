import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  ProjectFilesystemTransaction,
  ProjectManifest
} from "./project-execution.contracts";
import {
  ProjectGenerationPlan
} from "./project-generator.contracts";
import {
  ProjectFilesystemTransactionService
} from "./project-filesystem-transaction.service";

@Injectable()
export class ProjectManifestService {
  static readonly relativeManifestPath =
    ".avos/project-manifest.json";

  constructor(
    private readonly filesystem:
      ProjectFilesystemTransactionService
  ) {}

  async createAndWrite(
    plan: ProjectGenerationPlan,
    transaction: ProjectFilesystemTransaction
  ): Promise<{
    manifest: ProjectManifest;
    relativePath: string;
  }> {
    const manifest: ProjectManifest = {
      schemaVersion: "1.0",
      manifestId: randomUUID(),
      projectId: plan.projectId,
      projectName: plan.name,
      projectKind: plan.kind,
      planId: plan.id,
      requestId: plan.requestId,
      generatedBy: "AVOS Factory",
      humanFinalAuthority: true,
      requestedBy: plan.requestedBy,
      approvedBy: plan.approvedBy,
      generatedAt: new Date().toISOString(),
      outputPath: plan.outputPath,
      variables: structuredClone(plan.variables),
      artifacts: transaction.writes.map((write) => ({
        id: write.id,
        kind: write.kind,
        relativePath: write.relativePath,
        bytes: write.bytesWritten,
        checksum: write.checksum
      }))
    };

    await this.filesystem.writeGeneratedFile(
      transaction.id,
      ProjectManifestService.relativeManifestPath,
      `${JSON.stringify(manifest, null, 2)}\n`,
      "manifest"
    );

    return {
      manifest,
      relativePath:
        ProjectManifestService.relativeManifestPath
    };
  }
}
