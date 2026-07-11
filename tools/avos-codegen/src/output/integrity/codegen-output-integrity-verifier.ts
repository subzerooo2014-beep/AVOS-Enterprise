import {
  CodeGenIntegrityResult,
  CodeGenOutputManifest,
} from "../codegen-output.contracts";
import {
  CodeGenFileFingerprintEngine,
} from "../fingerprints/codegen-file-fingerprint-engine";

export class CodeGenOutputIntegrityVerifier {
  constructor(
    readonly fingerprints =
      new CodeGenFileFingerprintEngine(),
  ) {}

  async verify(
    manifest:
      CodeGenOutputManifest,
  ): Promise<
    CodeGenIntegrityResult
  > {
    const missing: string[] = [];

    const mismatched:
      CodeGenIntegrityResult["mismatched"] =
      [];

    for (
      const entry of
      manifest.entries
    ) {
      if (
        entry.status !==
        "written"
      ) {
        continue;
      }

      const fingerprint =
        await this.fingerprints
          .fingerprint(
            entry.absolutePath,
          );

      if (!fingerprint.exists) {
        missing.push(
          entry.absolutePath,
        );

        continue;
      }

      if (
        fingerprint.checksum !==
        entry.checksum
      ) {
        mismatched.push({
          absolutePath:
            entry.absolutePath,
          expectedChecksum:
            entry.checksum,
          ...(fingerprint.checksum
            ? {
                actualChecksum:
                  fingerprint.checksum,
              }
            : {}),
        });
      }
    }

    return {
      valid:
        missing.length === 0 &&
        mismatched.length === 0,
      checked:
        manifest.entries.filter(
          (entry) =>
            entry.status ===
            "written",
        ).length,
      missing,
      mismatched,
      verifiedAt:
        new Date().toISOString(),
    };
  }
}
