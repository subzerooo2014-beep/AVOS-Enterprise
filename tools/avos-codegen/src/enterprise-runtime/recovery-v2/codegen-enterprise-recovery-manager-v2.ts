import {
  CodeGenEnterpriseRecoveryRequest,
  CodeGenEnterpriseRecoveryResult,
  CodeGenEnterpriseRecoveryStatus,
} from "./codegen-enterprise-recovery.contracts";

export class CodeGenEnterpriseRecoveryManagerV2 {
  async recover(
    request:
      CodeGenEnterpriseRecoveryRequest,
  ): Promise<
    CodeGenEnterpriseRecoveryResult
  > {
    const startedAt =
      new Date().toISOString();

    const warnings: string[] = [];
    const errors: string[] = [];

    let restoredArtifacts = 0;
    let restoredCacheEntries = 0;

    try {
      if (
        request.restoreArtifacts
      ) {
        restoredArtifacts =
          request.session.artifacts.length;
      }

      if (
        request.restoreCache
      ) {
        restoredCacheEntries =
          request.session.metrics.cacheHits +
          request.session.metrics.cacheMisses;
      }

      if (
        request.validateAfterRestore &&
        request.session.errors.length > 0
      ) {
        warnings.push(
          "Recovered session contains previous errors",
        );
      }

      const completedAt =
        new Date().toISOString();

      return {
        success: true,
        status:
          CodeGenEnterpriseRecoveryStatus.COMPLETED,
        restoredArtifacts,
        restoredCacheEntries,
        warnings,
        errors,
        startedAt,
        completedAt,
        durationMs:
          Date.parse(
            completedAt,
          ) -
          Date.parse(
            startedAt,
          ),
      };
    } catch (error) {
      errors.push(
        error instanceof Error
          ? error.message
          : String(error),
      );

      const completedAt =
        new Date().toISOString();

      return {
        success: false,
        status:
          CodeGenEnterpriseRecoveryStatus.FAILED,
        restoredArtifacts,
        restoredCacheEntries,
        warnings,
        errors,
        startedAt,
        completedAt,
        durationMs:
          Date.parse(
            completedAt,
          ) -
          Date.parse(
            startedAt,
          ),
      };
    }
  }
}
