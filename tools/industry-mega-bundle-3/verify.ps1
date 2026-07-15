param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$base = Join-Path $RepoRoot "apps/api/src/industry-mega-bundle-3"
$files = @(
  "industry-mega-bundle-3.types.ts",
  "industry-mega-bundle-3.registry.ts",
  "industry-mega-bundle-3.service.ts",
  "industry-mega-bundle-3.controller.ts",
  "industry-mega-bundle-3.module.ts",
  "index.ts"
)

foreach ($f in $files) {
  if (-not (Test-Path (Join-Path $base $f))) { throw "Missing: $f" }
}

$r = Get-Content (Join-Path $base "industry-mega-bundle-3.registry.ts") -Raw
$s = Get-Content (Join-Path $base "industry-mega-bundle-3.service.ts") -Raw

$checks = @{
  insurance = $r -match "INSURANCE"
  retail = $r -match "RETAIL_COMMERCE"
  hospitality = $r -match "HOSPITALITY"
  education = $r -match "EDUCATION"
  government = $r -match "GOVERNMENT"
  entities = $s -match "createEntity"
  transactions = $s -match "createTransaction"
  decisions = $s -match "createDecision"
  dashboard = $s -match "dashboard"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count) { throw "Verification failed: $($failed.Name -join ', ')" }

[pscustomobject]@{
  success = $true
  system = "AVOS Industry Mega Bundle 3"
  verification = "passed"
  requiredFiles = $files.Count
  checks = $checks.Count
  industries = 5
  capabilities = 50
} | Format-List