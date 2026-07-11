import {
  resolve,
  relative,
} from "node:path";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenConflictPolicy,
  CodeGenConflictType,
  CodeGenOutputConflict,
} from "../codegen-output.contracts";
import {
  CodeGenFileFingerprintEngine,
} from "../fingerprints/codegen-file-fingerprint-engine";

export class CodeGenOutputConflictDetector {
  constructor(
    readonly fingerprints =
      new CodeGenFileFingerprintEngine(),
  ) {}

  async detect(
    input: {
      artifactKey: string;
      targetRoot: string;
      absolutePath: string;
      content: string;
      policy: CodeGenConflictPolicy;
      expectedChecksum?: string;
    },
  ): Promise<CodeGenOutputConflict> {
    const root =
      resolve(input.targetRoot);

    const path =
      resolve(input.absolutePath);

    const relativePath =
      relative(root, path);

    if (
      relativePath.startsWith("..") ||
      relativePath === ".."
    ) {
      return {
        artifactKey:
          input.artifactKey,
        absolutePath: path,
        type:
          CodeGenConflictType.PATH_OUTSIDE_TARGET,
        policy:
          input.policy,
        allowed: false,
        reason:
          "Artifact path resolves outside target root",
        detectedAt:
          new Date().toISOString(),
      };
    }

    const existing =
      await this.fingerprints
        .fingerprint(path);

    if (!existing.exists) {
      return {
        artifactKey:
          input.artifactKey,
        absolutePath: path,
        type:
          CodeGenConflictType.NONE,
        policy:
          input.policy,
        allowed: true,
        reason:
          "Target file does not exist",
        existingFingerprint:
          existing,
        expectedFingerprint:
          this.fingerprints
            .fingerprintContent(
              path,
              input.content,
            ),
        detectedAt:
          new Date().toISOString(),
      };
    }

    if (
      input.policy ===
      CodeGenConflictPolicy.SKIP
    ) {
      return {
        artifactKey:
          input.artifactKey,
        absolutePath: path,
        type:
          CodeGenConflictType.FILE_EXISTS,
        policy:
          input.policy,
        allowed: true,
        reason:
          "Existing file will be skipped",
        existingFingerprint:
          existing,
        detectedAt:
          new Date().toISOString(),
      };
    }

    if (
      input.policy ===
      CodeGenConflictPolicy.OVERWRITE
    ) {
      return {
        artifactKey:
          input.artifactKey,
        absolutePath: path,
        type:
          CodeGenConflictType.FILE_EXISTS,
        policy:
          input.policy,
        allowed: true,
        reason:
          "Overwrite policy allows replacement",
        existingFingerprint:
          existing,
        expectedFingerprint:
          this.fingerprints
            .fingerprintContent(
              path,
              input.content,
            ),
        detectedAt:
          new Date().toISOString(),
      };
    }

    if (
      input.policy ===
      CodeGenConflictPolicy.OVERWRITE_IF_UNCHANGED
    ) {
      if (
        !input.expectedChecksum
      ) {
        throw new CodeGenValidationError(
          `Expected checksum is required for overwrite_if_unchanged: ${path}`,
        );
      }

      const unchanged =
        existing.checksum ===
        input.expectedChecksum;

      return {
        artifactKey:
          input.artifactKey,
        absolutePath: path,
        type:
          unchanged
            ? CodeGenConflictType.FILE_EXISTS
            : CodeGenConflictType.CONTENT_CHANGED,
        policy:
          input.policy,
        allowed:
          unchanged,
        reason:
          unchanged
            ? "Existing file matches expected checksum"
            : "Existing file was modified outside CodeGen",
        existingFingerprint:
          existing,
        expectedFingerprint:
          this.fingerprints
            .fingerprintContent(
              path,
              input.content,
            ),
        detectedAt:
          new Date().toISOString(),
      };
    }

    return {
      artifactKey:
        input.artifactKey,
      absolutePath: path,
      type:
        CodeGenConflictType.FILE_EXISTS,
      policy:
        input.policy,
      allowed: false,
      reason:
        "Existing file conflicts with error policy",
      existingFingerprint:
        existing,
      detectedAt:
        new Date().toISOString(),
    };
  }
}
