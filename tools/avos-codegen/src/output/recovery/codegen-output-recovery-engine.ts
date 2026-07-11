import {
  readFile,
} from "node:fs/promises";
import {
  CodeGenValidationError,
} from "../../core/codegen.errors";
import {
  CodeGenOutputManifest,
} from "../codegen-output.contracts";
import {
  CodeGenOutputIntegrityVerifier,
} from "../integrity/codegen-output-integrity-verifier";

export class CodeGenOutputRecoveryEngine {
  constructor(
    readonly integrity =
      new CodeGenOutputIntegrityVerifier(),
  ) {}

  async inspectManifest(
    manifestPath: string,
  ): Promise<{
    manifest:
      CodeGenOutputManifest;
    integrity:
      Awaited<
        ReturnType<
          CodeGenOutputIntegrityVerifier["verify"]
        >
      >;
  }> {
    let manifest:
      CodeGenOutputManifest;

    try {
      manifest =
        JSON.parse(
          await readFile(
            manifestPath,
            "utf8",
          ),
        ) as CodeGenOutputManifest;
    } catch (error) {
      throw new CodeGenValidationError(
        `Unable to read output manifest: ${manifestPath}`,
        error,
      );
    }

    const integrity =
      await this.integrity.verify(
        manifest,
      );

    return {
      manifest,
      integrity,
    };
  }
}
