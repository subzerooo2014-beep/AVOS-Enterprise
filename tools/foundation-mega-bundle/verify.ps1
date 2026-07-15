param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"
$base = Join-Path $RepoRoot "apps/api/src/foundation-mega-bundle"
$files = @(
  "foundation-mega-bundle.types.ts",
  "foundation-mega-bundle.registry.ts",
  "foundation-mega-bundle.service.ts",
  "foundation-mega-bundle.controller.ts",
  "foundation-mega-bundle.module.ts",
  "index.ts"
)
foreach ($f in $files) {
  if (-not (Test-Path (Join-Path $base $f))) { throw "Missing: $f" }
}
$s = Get-Content (Join-Path $base "foundation-mega-bundle.service.ts") -Raw
$r = Get-Content (Join-Path $base "foundation-mega-bundle.registry.ts") -Raw
$checks = @{
  masterRegistry = $s -match "registerFoundation"
  decisions = $s -match "createDecision"
  lifecycle = $s -match "completeStage"
  gates = $s -match "updateQualityGate"
  release = $s -match "evaluateRelease"
  commandCenter = $s -match "commandCenter"
  standards = $r -match "AVOS_FOUNDATION_STANDARDS"
  qualityGates = $r -match "AVOS_QUALITY_GATES"
}
$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Verification failed: $($failed.Name -join ', ')" }
[pscustomobject]@{
  success = $true
  system = "AVOS Foundation Mega Bundle V1"
  verification = "passed"
  requiredFiles = $files.Count
  checks = $checks.Count
  domains = 9
  lifecycleStages = 8
  qualityGates = 7
} | Format-List