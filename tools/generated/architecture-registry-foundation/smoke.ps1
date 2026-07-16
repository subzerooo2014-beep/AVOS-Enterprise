$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/architecture-registry-foundation/architecture-registry-foundation.module.ts",
  "apps/web/src/app/architecture-registry-foundation/page.tsx",
  "apps/mobile/lib/features/architecture_registry_foundation/architecture_registry_foundation_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Architecture Registry Foundation"; smoke="PASS" } | Format-List