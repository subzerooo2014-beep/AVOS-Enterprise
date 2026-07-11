$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

node -e @"
const {
  CodeGenArtifactType,
  CodeGenWriteMode,
  CodeGenEnterpriseRuntimeOrchestrator
} = require('./dist');

(async () => {
  const runtime =
    new CodeGenEnterpriseRuntimeOrchestrator();

  const artifacts = [
    {
      id:
        'runtime-smoke-a',
      key:
        'runtime.smoke.a',
      type:
        CodeGenArtifactType.SOURCE,
      relativePath:
        'generated/runtime-smoke-a.ts',
      content:
        'export const runtimeSmokeA = true;\n',
      writeMode:
        CodeGenWriteMode.CREATE,
      dependencies: [],
      tags: [
        'runtime-smoke'
      ],
      metadata: {}
    },
    {
      id:
        'runtime-smoke-b',
      key:
        'runtime.smoke.b',
      type:
        CodeGenArtifactType.TEST,
      relativePath:
        'generated/runtime-smoke-b.spec.ts',
      content:
        'export const runtimeSmokeB = true;\n',
      writeMode:
        CodeGenWriteMode.CREATE,
      dependencies: [
        'runtime.smoke.a'
      ],
      tags: [
        'runtime-smoke'
      ],
      metadata: {}
    }
  ];

  const result =
    await runtime.execute({
      sessionId:
        'mega-pack-10-bundle-c-smoke',
      workspaceRoot:
        process.cwd(),
      targetRoot:
        process.cwd(),
      artifacts,
      maximumWorkers:
        2,
      enableRetry:
        false,
      dryRun:
        true,
      metadata: {
        owner:
          'AVOS',
        classification:
          'production-smoke'
      }
    });

  console.log(
    JSON.stringify(
      {
        success:
          result.success,
        succeeded:
          result.batch.succeeded,
        failed:
          result.batch.failed,
        skipped:
          result.batch.skipped,
        percentage:
          result.progress.percentage,
        telemetrySpans:
          result.telemetry.spans.length,
        successRate:
          result.metrics.statistics.successRate
      },
      null,
      2
    )
  );

  if (
    !result.success ||
    result.batch.succeeded !== 2 ||
    result.progress.percentage !== 100
  ) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
"@
