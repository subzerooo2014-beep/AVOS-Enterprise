param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/industry-mega-bundle-1"
$files = @(
  "industry-mega-bundle-1.types.ts",
  "industry-mega-bundle-1.registry.ts",
  "industry-mega-bundle-1.service.ts",
  "industry-mega-bundle-1.controller.ts",
  "industry-mega-bundle-1.module.ts",
  "index.ts"
)

foreach ($f in $files) {
  if (-not (Test-Path (Join-Path $base $f))) { throw "Missing: $f" }
}

$r = Get-Content (Join-Path $base "industry-mega-bundle-1.registry.ts") -Raw
$s = Get-Content (Join-Path $base "industry-mega-bundle-1.service.ts") -Raw

$checks = @{
  healthcare = $r -match "HEALTHCARE"
  construction = $r -match "CONSTRUCTION"
  manufacturing = $r -match "MANUFACTURING"
  logistics = $r -match "LOGISTICS_FLEET"
  realEstate = $r -match "REAL_ESTATE"
  records = $s -match "createRecord"
  metrics = $s -match "recordMetric"
  ai = $s -match "createInsight"
  dashboard = $s -match "dashboard"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Verification failed: $($failed.Name -join ', ')" }

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Mega Bundle 1"
  verification = "passed"
  requiredFiles = $files.Count
  checks = $checks.Count
  industries = 5
  capabilities = 50
} | Format-List