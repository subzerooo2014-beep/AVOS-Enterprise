import {
  CodeGenUnifiedGenerationMode,
  CodeGenUnifiedGenerationResult,
} from "../requests/codegen-unified-generation.contracts";

export class CodeGenUnifiedGenerationResultBuilder {
  build(
    input: {
      success: boolean;
      mode:
        CodeGenUnifiedGenerationMode;
      key: string;
      artifacts:
        CodeGenUnifiedGenerationResult["artifacts"];
      manifest?:
        CodeGenUnifiedGenerationResult["manifest"];
      report?:
        CodeGenUnifiedGenerationResult["report"];
      warnings?: string[];
      errors?: string[];
      startedAt: string;
    },
  ): CodeGenUnifiedGenerationResult {
    const completedAt =
      new Date().toISOString();

    return {
      success:
        input.success,
      mode:
        input.mode,
      key:
        input.key,
      artifacts:
        structuredClone(
          input.artifacts,
        ),
      ...(input.manifest
        ? {
            manifest:
              structuredClone(
                input.manifest,
              ),
          }
        : {}),
      ...(input.report
        ? {
            report:
              structuredClone(
                input.report,
              ),
          }
        : {}),
      warnings:
        [...(input.warnings ?? [])],
      errors:
        [...(input.errors ?? [])],
      startedAt:
        input.startedAt,
      completedAt,
      durationMs:
        Date.parse(
          completedAt,
        ) -
        Date.parse(
          input.startedAt,
        ),
    };
  }
}
