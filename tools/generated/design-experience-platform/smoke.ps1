$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/design-experience-platform/design-experience-platform.module.ts",
  "apps/web/src/app/design-experience-platform/page.tsx",
  "apps/mobile/lib/features/design_experience_platform/design_experience_platform_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Design and Experience Platform"; smoke="PASS" } | Format-List