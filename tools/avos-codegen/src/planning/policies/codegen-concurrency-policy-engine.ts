import {
  CodeGenConcurrencyMode,
  CodeGenConcurrencyPolicy,
} from "../scheduling/codegen-scheduling.contracts";

export class CodeGenConcurrencyPolicyEngine {
  normalize(
    input:
      Partial<
        CodeGenConcurrencyPolicy
      > = {},
  ): CodeGenConcurrencyPolicy {
    const mode =
      input.mode ??
      CodeGenConcurrencyMode.BOUNDED;

    const maxParallel =
      mode ===
      CodeGenConcurrencyMode.SERIAL
        ? 1
        : Math.max(
            1,
            input.maxParallel ??
              4,
          );

    return {
      mode,
      maxParallel,
      preserveStageOrder:
        input.preserveStageOrder ??
        true,
      failFast:
        input.failFast ??
        true,
    };
  }
}
