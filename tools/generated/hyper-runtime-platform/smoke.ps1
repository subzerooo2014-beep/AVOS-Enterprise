$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/hyper-runtime-platform/hyper-runtime-platform.module.ts",
  "apps/web/src/app/hyper-runtime-platform/page.tsx",
  "apps/mobile/lib/features/hyper_runtime_platform/hyper_runtime_platform_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Hyper Runtime Platform"; smoke="PASS" } | Format-List