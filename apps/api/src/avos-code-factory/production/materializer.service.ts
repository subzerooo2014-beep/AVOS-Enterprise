import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";
import {
  FactoryMaterializationResult,
  FactoryMaterializedFile,
} from "../contracts/materialization.contracts";
import { FactoryGenerationPackageService } from "../generation/package.service";
import { FactoryProjectService } from "../workspace/project.service";
import { createFactoryId } from "../utils/factory-id.util";
import { FactoryWorkspacePathService } from "./workspace-path.service";

@Injectable()
export class FactoryMaterializerService {
  private readonly results = new Map<string, FactoryMaterializationResult>();

  constructor(
    private readonly packages: FactoryGenerationPackageService,
    private readonly projects: FactoryProjectService,
    private readonly paths: FactoryWorkspacePathService,
  ) {}

  materialize(
    packageId: string,
    targetDirectory?: string,
    overwrite = false,
  ): FactoryMaterializationResult {
    const generationPackage = this.packages.get(packageId);
    if (!generationPackage) {
      throw new Error(`Generation package '${packageId}' was not found.`);
    }

    const project = this.projects.get(generationPackage.projectId);
    if (!project) {
      throw new Error(
        `Factory project '${generationPackage.projectId}' was not found.`,
      );
    }

    const workspacePath = this.paths.resolveWorkspace(
      project.slug,
      targetDirectory,
    );

    if (fs.existsSync(workspacePath) && !overwrite) {
      const hasFiles = fs.readdirSync(workspacePath).length > 0;
      if (hasFiles) {
        throw new Error(
          `Workspace '${workspacePath}' already exists and overwrite is false.`,
        );
      }
    }

    fs.mkdirSync(workspacePath, { recursive: true });

    const files: FactoryMaterializedFile[] = generationPackage.files.map(
      (file) => {
        const absolutePath = this.paths.resolveSafeFile(
          workspacePath,
          file.relativePath,
        );

        fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
        fs.writeFileSync(absolutePath, file.content, "utf8");

        return {
          artifactId: file.artifactId ?? "unpersisted",
          relativePath: file.relativePath,
          absolutePath,
          checksum: file.checksum,
          bytes: Buffer.byteLength(file.content, "utf8"),
        };
      },
    );

    const result: FactoryMaterializationResult = {
      id: createFactoryId("factory-materialization"),
      projectId: generationPackage.projectId,
      packageId,
      workspacePath,
      files,
      createdAt: new Date().toISOString(),
    };

    this.results.set(result.id, result);
    return result;
  }

  get(id: string) {
    return this.results.get(id);
  }

  list() {
    return [...this.results.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
}
