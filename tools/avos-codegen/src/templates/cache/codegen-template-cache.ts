import {
  CodeGenCompiledTemplate,
  CodeGenTemplateCacheEntry,
  CodeGenTemplateCacheSnapshot,
} from "../codegen-template.contracts";

export class CodeGenTemplateCache {
  private readonly entries =
    new Map<
      string,
      CodeGenTemplateCacheEntry
    >();

  private hitCount = 0;
  private missCount = 0;

  get(
    key: string,
    checksum?: string,
  ): CodeGenCompiledTemplate | undefined {
    const entry =
      this.entries.get(key);

    if (
      !entry ||
      (
        checksum !== undefined &&
        entry.checksum !== checksum
      )
    ) {
      this.missCount += 1;
      return undefined;
    }

    entry.hits += 1;
    entry.lastAccessedAt =
      new Date().toISOString();

    this.hitCount += 1;

    return structuredClone(
      entry.compiled,
    );
  }

  set(
    compiled: CodeGenCompiledTemplate,
  ): CodeGenCompiledTemplate {
    const now =
      new Date().toISOString();

    this.entries.set(
      compiled.key,
      {
        key: compiled.key,
        checksum: compiled.checksum,
        compiled:
          structuredClone(compiled),
        hits: 0,
        createdAt: now,
        lastAccessedAt: now,
      },
    );

    return structuredClone(compiled);
  }

  has(
    key: string,
    checksum?: string,
  ): boolean {
    const entry =
      this.entries.get(key);

    if (!entry) {
      return false;
    }

    return checksum === undefined ||
      entry.checksum === checksum;
  }

  remove(key: string): boolean {
    return this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  snapshot():
    CodeGenTemplateCacheSnapshot {
    return {
      size: this.entries.size,
      hits: this.hitCount,
      misses: this.missCount,
      entries:
        Array.from(
          this.entries.values(),
        )
          .map((entry) => ({
            key: entry.key,
            checksum: entry.checksum,
            hits: entry.hits,
            createdAt:
              entry.createdAt,
            lastAccessedAt:
              entry.lastAccessedAt,
          }))
          .sort((left, right) =>
            left.key.localeCompare(
              right.key,
            ),
          ),
      generatedAt:
        new Date().toISOString(),
    };
  }
}
