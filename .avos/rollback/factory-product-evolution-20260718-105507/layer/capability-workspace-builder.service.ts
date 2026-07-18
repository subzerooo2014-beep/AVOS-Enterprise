import { Injectable } from "@nestjs/common";
import {
  existsSync,
  mkdirSync,
  rmSync
} from "node:fs";
import { resolve } from "node:path";
import { CapabilityProductionBlueprint } from "./capability-production-persistence.contracts";
import { CapabilityProductionPathsService } from "./capability-production-paths.service";

export interface CapabilityWorkspace {
  slug: string;
  version: string;
  workspacePath: string;
  sourcePath: string;
  dtoPath: string;
  testPath: string;
  manifestPath: string;
}

@Injectable()
export class CapabilityWorkspaceBuilderService {
  constructor(
    private readonly paths: CapabilityProductionPathsService
  ) {}

  create(
    blueprint: CapabilityProductionBlueprint,
    clean = true
  ): CapabilityWorkspace {
    const slug = this.slug(blueprint.name);
    const workspacePath = this.paths.workspace(
      slug,
      blueprint.version
    );

    this.assertSafeWorkspace(workspacePath);

    if (clean && existsSync(workspacePath)) {
      rmSync(workspacePath, {
        recursive: true,
        force: true
      });
    }

    const sourcePath = resolve(workspacePath, "src");
    const dtoPath = resolve(sourcePath, "dto");
    const testPath = resolve(workspacePath, "test");
    const manifestPath = resolve(
      workspacePath,
      "capability.manifest.json"
    );

    [
      workspacePath,
      sourcePath,
      dtoPath,
      testPath
    ].forEach((path) => {
      mkdirSync(path, { recursive: true });
    });

    return {
      slug,
      version: blueprint.version,
      workspacePath,
      sourcePath,
      dtoPath,
      testPath,
      manifestPath
    };
  }

  slug(value: string): string {
    const result = value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!result) {
      throw new Error(
        "Capability name cannot produce an empty slug."
      );
    }

    return result;
  }

  className(value: string): string {
    const result = value
      .replace(/[^A-Za-z0-9]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(
        (part) =>
          `${part.charAt(0).toUpperCase()}${part.slice(1)}`
      )
      .join("");

    if (!result) {
      throw new Error(
        "Capability name cannot produce an empty class name."
      );
    }

    return result;
  }

  private assertSafeWorkspace(
    workspacePath: string
  ): void {
    const generatedRoot = resolve(
      this.paths.getGeneratedRoot()
    );
    const normalizedWorkspace = resolve(workspacePath);

    if (
      normalizedWorkspace === generatedRoot ||
      normalizedWorkspace.startsWith(`${generatedRoot}\\`) ||
      normalizedWorkspace.startsWith(`${generatedRoot}/`)
    ) {
      return;
    }

    throw new Error(
      "Generated workspace is outside the approved root."
    );
  }
}
