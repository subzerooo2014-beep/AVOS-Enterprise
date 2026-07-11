import { randomUUID } from "node:crypto";
import {
  CodeGenManifest,
  CodeGenManifestType,
  CodeGenMetadata,
  CodeGenVersion,
} from "../core/codegen.contracts";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";
import {
  formatCodeGenVersion,
} from "../core/codegen-version";

export interface CreateManifestInput {
  key: string;
  name: string;
  description?: string;
  type: CodeGenManifestType;
  version: CodeGenVersion;
  enabled?: boolean;
  entrypoint?: string;
  dependencies?: string[];
  capabilities?: string[];
  minimumCodeGenVersion?: string;
  maximumCodeGenVersion?: string;
  supportedAvosVersions?: string[];
  metadata?: CodeGenMetadata;
}

export class CodeGenManifestEngine {
  private readonly manifests =
    new Map<string, CodeGenManifest>();

  create(
    input: CreateManifestInput,
  ): CodeGenManifest {
    const key = input.key.trim();

    if (!key) {
      throw new CodeGenValidationError(
        "Manifest key is required",
      );
    }

    if (this.manifests.has(key)) {
      throw new CodeGenValidationError(
        `Manifest already exists: ${key}`,
      );
    }

    if (
      input.dependencies?.includes(
        key,
      )
    ) {
      throw new CodeGenValidationError(
        `Manifest cannot depend on itself: ${key}`,
      );
    }

    const now = new Date().toISOString();

    const manifest:
      CodeGenManifest = {
      id: randomUUID(),
      key,
      name: input.name.trim(),
      ...(input.description
        ? {
            description:
              input.description,
          }
        : {}),
      type: input.type,
      version: input.version,
      enabled: input.enabled ?? true,
      ...(input.entrypoint
        ? {
            entrypoint:
              input.entrypoint,
          }
        : {}),
      dependencies: Array.from(
        new Set(
          input.dependencies ?? [],
        ),
      ),
      capabilities: Array.from(
        new Set(
          input.capabilities ?? [],
        ),
      ),
      compatibility: {
        ...(input.minimumCodeGenVersion
          ? {
              minimumCodeGenVersion:
                input.minimumCodeGenVersion,
            }
          : {}),
        ...(input.maximumCodeGenVersion
          ? {
              maximumCodeGenVersion:
                input.maximumCodeGenVersion,
            }
          : {}),
        supportedAvosVersions:
          input.supportedAvosVersions ??
          [],
      },
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    this.manifests.set(key, manifest);

    return structuredClone(manifest);
  }

  register(
    manifest: CodeGenManifest,
    replace = false,
  ): CodeGenManifest {
    if (
      this.manifests.has(
        manifest.key,
      ) &&
      !replace
    ) {
      throw new CodeGenValidationError(
        `Manifest already exists: ${manifest.key}`,
      );
    }

    this.manifests.set(
      manifest.key,
      structuredClone(manifest),
    );

    return structuredClone(manifest);
  }

  get(key: string): CodeGenManifest {
    const manifest =
      this.manifests.get(key);

    if (!manifest) {
      throw new CodeGenValidationError(
        `Manifest was not found: ${key}`,
      );
    }

    return structuredClone(manifest);
  }

  find(
    key: string,
  ): CodeGenManifest | undefined {
    const manifest =
      this.manifests.get(key);

    return manifest
      ? structuredClone(manifest)
      : undefined;
  }

  list(): CodeGenManifest[] {
    return Array.from(
      this.manifests.values(),
    )
      .map((manifest) =>
        structuredClone(manifest),
      )
      .sort((left, right) =>
        left.key.localeCompare(
          right.key,
        ),
      );
  }

  remove(key: string): CodeGenManifest {
    const manifest = this.get(key);

    this.manifests.delete(key);

    return manifest;
  }

  verifyDependencies(
    key: string,
  ): {
    valid: boolean;
    missingDependencies: string[];
    checkedManifest: string;
    checkedVersion: string;
  } {
    const manifest = this.get(key);

    const missingDependencies =
      manifest.dependencies.filter(
        (dependencyKey) =>
          !this.manifests.has(
            dependencyKey,
          ),
      );

    return {
      valid:
        missingDependencies.length ===
        0,
      missingDependencies,
      checkedManifest:
        manifest.key,
      checkedVersion:
        formatCodeGenVersion(
          manifest.version,
        ),
    };
  }

  clear(): void {
    this.manifests.clear();
  }
}
