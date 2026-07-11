$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

node -e @"
const {
  CodeGenEndToEndSmokeRunner
} = require('./dist');

(async () => {
  const runner =
    new CodeGenEndToEndSmokeRunner();

  const result =
    await runner.run(process.cwd());

  console.log(
    JSON.stringify(
      result,
      null,
      2
    )
  );

  if (!result.success) {
    process.exit(1);
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
"@
