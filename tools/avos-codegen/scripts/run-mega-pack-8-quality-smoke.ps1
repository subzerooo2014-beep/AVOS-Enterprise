$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

node -e @"
const {
  CodeGenQualityRuntime,
  CodeGenArtifactType,
  CodeGenWriteMode
} = require('./dist');

(async () => {
  const runtime =
    new CodeGenQualityRuntime();

  const report =
    await runtime.execute([
      {
        id: 'quality-smoke-module',
        key: 'quality.smoke.module',
        type:
          CodeGenArtifactType.SOURCE,
        relativePath:
          'src/quality-smoke/quality-smoke.module.ts',
        content:
          'import { Module } from "@nestjs/common";\n@Module({})\nexport class QualitySmokeModule {}\n',
        writeMode:
          CodeGenWriteMode.CREATE,
        dependencies: [],
        tags: ['quality-smoke'],
        metadata: {}
      }
    ]);

  console.log(
    JSON.stringify(
      report,
      null,
      2
    )
  );

  if (!report.success) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
"@
