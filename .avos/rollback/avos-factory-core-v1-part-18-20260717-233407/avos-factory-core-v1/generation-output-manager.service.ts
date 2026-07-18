import { Injectable } from "@nestjs/common";
import { createHash } from "crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync
} from "fs";
import {
  dirname,
  isAbsolute,
  join,
  normalize,
  relative,
  resolve
} from "path";
import {
  GeneratedArtifact,
  GeneratedArtifactType
} from "./code-generation.contracts";
import {
  GenerationOutputError
} from "./code-generation.errors";

interface WriteArtifactInput {
  generationId: string;
  relativePath: string;
  content: string;
  type?: GeneratedArtifactType;
  outputRoot: string;
  dryRun: boolean;
  overwrite: boolean;
}

@Injectable()
export class GenerationOutputManagerService {
  createArtifact(
    input: WriteArtifactInput
  ): GeneratedArtifact {
    const normalizedRelativePath =
      this.normalizeRelativePath(
        input.relativePath
      );

    const absolutePath =
      this.resolveInsideRoot(
        input.outputRoot,
        normalizedRelativePath
      );

    const alreadyExists =
      existsSync(absolutePath);

    if (
      alreadyExists &&
      !input.overwrite &&
      !input.dryRun
    ) {
      throw new GenerationOutputError(
        `Generated output already exists: ${normalizedRelativePath}`
      );
    }

    if (!input.dryRun) {
      this.atomicWrite(
        absolutePath,
        input.content
      );
    }

    return {
      id: this.checksum(
        `${input.generationId}:${normalizedRelativePath}`
      ),
      generationId:
        input.generationId,
      type:
        input.type ??
        this.detectType(
          normalizedRelativePath
        ),
      relativePath:
        normalizedRelativePath,
      absolutePath,
      content: input.content,
      contentLength:
        Buffer.byteLength(
          input.content,
          "utf8"
        ),
      checksum:
        this.checksum(input.content),
      written: !input.dryRun,
      overwritten:
        alreadyExists &&
        !input.dryRun,
      createdAt:
        new Date().toISOString()
    };
  }

  rollback(
    artifacts: GeneratedArtifact[]
  ): number {
    let removed = 0;

    for (
      const artifact
      of [...artifacts].reverse()
    ) {
      if (
        !artifact.written ||
        !artifact.absolutePath
      ) {
        continue;
      }

      if (
        existsSync(
          artifact.absolutePath
        )
      ) {
        rmSync(
          artifact.absolutePath,
          { force: true }
        );

        removed += 1;
      }
    }

    return removed;
  }

  verifyArtifact(
    artifact: GeneratedArtifact
  ): boolean {
    if (
      !artifact.written ||
      !artifact.absolutePath ||
      !existsSync(artifact.absolutePath)
    ) {
      return false;
    }

    const content =
      readFileSync(
        artifact.absolutePath,
        "utf8"
      );

    return (
      this.checksum(content) ===
      artifact.checksum
    );
  }

  private atomicWrite(
    absolutePath: string,
    content: string
  ): void {
    const directory =
      dirname(absolutePath);

    mkdirSync(
      directory,
      { recursive: true }
    );

    const temporaryPath =
      `${absolutePath}.avos-tmp-${Date.now()}`;

    try {
      writeFileSync(
        temporaryPath,
        content,
        "utf8"
      );

      renameSync(
        temporaryPath,
        absolutePath
      );
    } catch (error) {
      if (
        existsSync(temporaryPath)
      ) {
        rmSync(
          temporaryPath,
          { force: true }
        );
      }

      throw new GenerationOutputError(
        error instanceof Error
          ? `Atomic output write failed: ${error.message}`
          : "Atomic output write failed."
      );
    }
  }

  private resolveInsideRoot(
    outputRoot: string,
    relativePathValue: string
  ): string {
    const root =
      resolve(outputRoot);

    const candidate =
      resolve(
        join(
          root,
          relativePathValue
        )
      );

    const relation =
      relative(root, candidate);

    if (
      relation.startsWith("..") ||
      isAbsolute(relation)
    ) {
      throw new GenerationOutputError(
        "Generated output escaped the configured output root."
      );
    }

    return candidate;
  }

  private normalizeRelativePath(
    value: string
  ): string {
    if (
      !value ||
      value.trim().length === 0
    ) {
      throw new GenerationOutputError(
        "Generated artifact path is required."
      );
    }

    const normalized =
      normalize(value)
        .replace(/\\/g, "/")
        .replace(/^\.\/+/, "");

    if (
      normalized.startsWith("/") ||
      /^[A-Za-z]:\//.test(normalized) ||
      normalized
        .split("/")
        .some(
          (segment) =>
            segment === ".."
        )
    ) {
      throw new GenerationOutputError(
        `Unsafe generated artifact path: ${value}`
      );
    }

    return normalized;
  }

  private checksum(
    content: string
  ): string {
    return createHash("sha256")
      .update(content)
      .digest("hex");
  }

  private detectType(
    filePath: string
  ): GeneratedArtifactType {
    const lower =
      filePath.toLowerCase();

    if (lower.endsWith(".ts")) {
      return "typescript";
    }

    if (
      lower.endsWith(".js") ||
      lower.endsWith(".mjs") ||
      lower.endsWith(".cjs")
    ) {
      return "javascript";
    }

    if (lower.endsWith(".json")) {
      return "json";
    }

    if (
      lower.endsWith(".md") ||
      lower.endsWith(".markdown")
    ) {
      return "markdown";
    }

    if (
      lower.endsWith(".yaml") ||
      lower.endsWith(".yml") ||
      lower.endsWith(".toml") ||
      lower.endsWith(".env")
    ) {
      return "configuration";
    }

    if (
      lower.endsWith(".txt")
    ) {
      return "text";
    }

    return "unknown";
  }
}
