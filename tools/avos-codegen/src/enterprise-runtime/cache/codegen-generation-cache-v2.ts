import {
  createHash,
} from "node:crypto";
import {
  CodeGenArtifactDescriptor,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenGenerationCacheEntry,
  CodeGenGenerationCacheStats,
} from "./codegen-generation-cache-v2.contracts";

export class CodeGenGenerationCacheV2 {
  private readonly entries =
    new Map<
      string,
      CodeGenGenerationCacheEntry
    >();

  private hits = 0;
  private misses = 0;

  fingerprint(
    artifact:
      CodeGenArtifactDescriptor,
  ): string {
    return createHash("sha256")
      .update(
        JSON.stringify({
          key:
            artifact.key,
          relativePath:
            artifact.relativePath,
          content:
            artifact.content,
          dependencies:
            artifact.dependencies,
          metadata:
            artifact.metadata,
        }),
      )
      .digest("hex");
  }

  get(
    artifact:
      CodeGenArtifactDescriptor,
  ):
    CodeGenGenerationCacheEntry |
    undefined {
    const key =
      artifact.key;

    const entry =
      this.entries.get(key);

    const fingerprint =
      this.fingerprint(
        artifact,
      );

    if (
      !entry ||
      entry.fingerprint !==
        fingerprint
    ) {
      this.misses += 1;
      return undefined;
    }

    entry.hits += 1;
    entry.updatedAt =
      new Date().toISOString();

    this.hits += 1;

    return structuredClone(
      entry,
    );
  }

  put(
    artifact:
      CodeGenArtifactDescriptor,
  ): CodeGenGenerationCacheEntry {
    const now =
      new Date().toISOString();

    const existing =
      this.entries.get(
        artifact.key,
      );

    const entry:
      CodeGenGenerationCacheEntry = {
      key:
        artifact.key,
      fingerprint:
        this.fingerprint(
          artifact,
        ),
      artifact:
        structuredClone(
          artifact,
        ),
      metadata: {
        relativePath:
          artifact.relativePath,
        artifactType:
          artifact.type,
      },
      createdAt:
        existing?.createdAt ??
        now,
      updatedAt:
        now,
      hits:
        existing?.hits ??
        0,
    };

    this.entries.set(
      artifact.key,
      entry,
    );

    return structuredClone(
      entry,
    );
  }

  remove(
    key: string,
  ):
    CodeGenGenerationCacheEntry |
    undefined {
    const entry =
      this.entries.get(key);

    if (!entry) {
      return undefined;
    }

    this.entries.delete(key);

    return structuredClone(
      entry,
    );
  }

  stats():
    CodeGenGenerationCacheStats {
    const total =
      this.hits +
      this.misses;

    return {
      entries:
        this.entries.size,
      hits:
        this.hits,
      misses:
        this.misses,
      hitRatio:
        total === 0
          ? 0
          : this.hits /
            total,
      generatedAt:
        new Date().toISOString(),
    };
  }

  clear(): void {
    this.entries.clear();
    this.hits = 0;
    this.misses = 0;
  }
}
