$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$required = @(
  "apps/api/src/core-foundation-stack/core-foundation-stack.module.ts",
  "apps/web/src/app/core-foundation-stack/page.tsx",
  "apps/mobile/lib/features/core_foundation_stack/core_foundation_stack_screen.dart"
)
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Smoke missing: $($missing -join ', ')" }
[pscustomobject]@{ success=$true; system="AVOS Core Foundation Stack"; smoke="PASS" } | Format-List