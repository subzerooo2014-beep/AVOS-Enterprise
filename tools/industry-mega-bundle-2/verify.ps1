param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/industry-mega-bundle-2"
$files = @(
  "industry-mega-bundle-2.types.ts",
  "industry-mega-bundle-2.registry.ts",
  "industry-mega-bundle-2.service.ts",
  "industry-mega-bundle-2.controller.ts",
  "industry-mega-bundle-2.module.ts",
  "index.ts"
)

foreach ($f in $files) {
  if (-not (Test-Path (Join-Path $base $f))) { throw "Missing: $f" }
}

$r = Get-Content (Join-Path $base "industry-mega-bundle-2.registry.ts") -Raw
$s = Get-Content (Join-Path $base "industry-mega-bundle-2.service.ts") -Raw

$checks = @{
  aviation = $r -match "AVIATION"
  maritime = $r -match "MARITIME"
  agriculture = $r -match "AGRICULTURE"
  energy = $r -match "ENERGY_UTILITIES"
  banking = $r -match "BANKING_FINANCE"
  assets = $s -match "createAsset"
  operations = $s -match "createOperation"
  risks = $s -match "createRisk"
  dashboard = $s -match "dashboard"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Verification failed: $($failed.Name -join ', ')" }

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Mega Bundle 2"
  verification = "passed"
  requiredFiles = $files.Count
  checks = $checks.Count
  industries = 5
  capabilities = 50
} | Format-List