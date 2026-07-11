$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

node -e @"
const {
  CodeGenArtifactType,
  CodeGenWriteMode,
  CodeGenEnterpriseEndToEndRuntime
} = require('./dist');

(async () => {
  const runtime =
    new CodeGenEnterpriseEndToEndRuntime();

  const result =
    await runtime.execute({
      sessionId:
        'mega-pack-10-bundle-d-smoke',
      workspaceRoot:
        process.cwd(),
      targetRoot:
        process.cwd(),
      artifacts: [
        {
          id:
            'bundle-d-a',
          key:
            'bundle.d.a',
          type:
            CodeGenArtifactType.SOURCE,
          relativePath:
            'generated/bundle-d-a.ts',
          content:
            'export const bundleDA = true;\n',
          writeMode:
            CodeGenWriteMode.CREATE,
          dependencies: [],
          tags: [
            'bundle-d-smoke'
          ],
          metadata: {}
        },
        {
          id:
            'bundle-d-b',
          key:
            'bundle.d.b',
          type:
            CodeGenArtifactType.TEST,
          relativePath:
            'generated/bundle-d-b.spec.ts',
          content:
            'export const bundleDB = true;\n',
          writeMode:
            CodeGenWriteMode.CREATE,
          dependencies: [
            'bundle.d.a'
          ],
          tags: [
            'bundle-d-smoke'
          ],
          metadata: {}
        }
      ],
      maximumWorkers:
        2,
      enableRetry:
        false,
      dryRun:
        true,
      validateReadiness:
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
        readiness:
          result.readiness.ready,
        score:
          result.readiness.score,
        succeeded:
          result.orchestration.batch.succeeded,
        failed:
          result.orchestration.batch.failed,
        skipped:
          result.orchestration.batch.skipped,
        progress:
          result.orchestration.progress.percentage
      },
      null,
      2
    )
  );

  if (
    !result.success ||
    !result.readiness.ready ||
    result.orchestration.batch.succeeded !== 2
  ) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
"@
