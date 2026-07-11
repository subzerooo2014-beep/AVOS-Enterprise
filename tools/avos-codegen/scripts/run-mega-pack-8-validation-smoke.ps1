$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

node -e @"
const {
  CodeGenValidationRuntime
} = require('./dist');

(async () => {
  const runtime =
    new CodeGenValidationRuntime();

  const result =
    await runtime.execute({
      workspaceRoot:
        process.cwd(),
      targetRoot:
        process.cwd(),
      blueprintKey:
        'enterprise-module-v2',
      templateKeys: [
        'enterprise-module.module'
      ],
      variables: {
        moduleName:
          'Validation Smoke'
      },
      artifacts: [],
      featureFlags: {},
      metadata: {
        owner: 'AVOS',
        classification:
          'production-smoke'
      }
    });

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

  if (
    result.health.status ===
    'unhealthy'
  ) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
"@
