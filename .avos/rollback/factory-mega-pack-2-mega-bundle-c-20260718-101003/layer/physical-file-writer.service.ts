import { Injectable } from "@nestjs/common";
import {
  mkdirSync,
  writeFileSync
} from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { CapabilityArtifact } from "./capability-production-persistence.contracts";
import { CapabilityProductionPathsService } from "./capability-production-paths.service";

export interface PhysicalWriteRequest {
  workspacePath: string;
  relativePath: string;
  content: string;
  kind: string;
}

@Injectable()
export class PhysicalFileWriterService {
  constructor(
    private readonly paths: CapabilityProductionPathsService
  ) {}

  write(request: PhysicalWriteRequest): CapabilityArtifact {
    const target = resolve(
      request.workspacePath,
      request.relativePath
    );

    this.assertSafePath(request.workspacePath, target);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, request.content, "utf8");

    return {
      relativePath: request.relativePath,
      kind: request.kind,
      checksum: createHash("sha256")
        .update(request.content)
        .digest("hex"),
      size: Buffer.byteLength(request.content, "utf8")
    };
  }

  writeMany(
    requests: PhysicalWriteRequest[]
  ): CapabilityArtifact[] {
    return requests.map((request) => this.write(request));
  }

  private assertSafePath(
    workspacePath: string,
    target: string
  ): void {
    const generatedRoot = resolve(this.paths.getGeneratedRoot());
    const normalizedWorkspace = resolve(workspacePath);

    if (
      normalizedWorkspace !== generatedRoot &&
      !normalizedWorkspace.startsWith(`${generatedRoot}\\`) &&
      !normalizedWorkspace.startsWith(`${generatedRoot}/`)
    ) {
      throw new Error(
        "Workspace is outside the AVOS generated capabilities root."
      );
    }

    if (
      target !== normalizedWorkspace &&
      !target.startsWith(`${normalizedWorkspace}\\`) &&
      !target.startsWith(`${normalizedWorkspace}/`)
    ) {
      throw new Error(
        "Target path escapes the generated capability workspace."
      );
    }
  }
}
