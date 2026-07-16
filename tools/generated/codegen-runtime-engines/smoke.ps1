$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/codegen-runtime-engines/codegen-runtime-engines.module.ts",
  "apps/web/src/app/codegen-runtime-engines/page.tsx",
  "apps/mobile/lib/features/codegen_runtime_engines/codegen_runtime_engines_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS CodeGen Runtime Engines"; smoke="PASS" } | Format-List