import {
  CodeGenArtifactChangeType,
  CodeGenIncrementalMetrics,
  CodeGenIncrementalRun,
  CodeGenRegenerationDecision,
} from "../contracts/codegen-incremental.contracts";

export class CodeGenIncrementalMetricsEngine {
  calculate(
    run:
      CodeGenIncrementalRun,
    startedAt: string,
  ): CodeGenIncrementalMetrics {
    const items =
      run.plan?.items ?? [];

    const artifacts =
      run.changes.length;

    const skipped =
      items.filter(
        (item) =>
          item.decision ===
          CodeGenRegenerationDecision.SKIP,
      ).length;

    const generated =
      items.filter(
        (item) =>
          item.decision ===
          CodeGenRegenerationDecision.GENERATE,
      ).length;

    const regenerated =
      items.filter(
        (item) =>
          item.decision ===
          CodeGenRegenerationDecision.REGENERATE,
      ).length;

    return {
      artifacts,
      created:
        run.changes.filter(
          (change) =>
            change.type ===
            CodeGenArtifactChangeType.CREATED,
        ).length,
      modified:
        run.changes.filter(
          (change) =>
            change.type ===
            CodeGenArtifactChangeType.MODIFIED ||
            change.type ===
            CodeGenArtifactChangeType.MOVED,
        ).length,
      unchanged:
        run.changes.filter(
          (change) =>
            change.type ===
            CodeGenArtifactChangeType.UNCHANGED,
        ).length,
      deleted:
        run.changes.filter(
          (change) =>
            change.type ===
            CodeGenArtifactChangeType.DELETED,
        ).length,
      conflicted:
        run.changes.filter(
          (change) =>
            change.type ===
            CodeGenArtifactChangeType.CONFLICTED,
        ).length,
      generated,
      regenerated,
      skipped,
      savedWorkRatio:
        artifacts === 0
          ? 1
          : skipped /
            artifacts,
      durationMs:
        Date.now() -
        Date.parse(
          startedAt,
        ),
      generatedAt:
        new Date().toISOString(),
    };
  }
}
