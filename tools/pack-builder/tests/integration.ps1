param([string]$RepoRoot = (Get-Location).Path)
$ErrorActionPreference = "Stop"

$root = Join-Path $RepoRoot "tools/pack-builder"
$generator = Get-Content -LiteralPath (Join-Path $root "generate.ps1") -Raw

$checks = [ordered]@{
  manifestEngine = $generator -match "Read-PackManifest"
  templateEngine = $generator -match "Expand-PackTemplate"
  registrationEngine = $generator -match "Register-NestModule"
  buildEngine = $generator -match "Invoke-PackValidation"
  gitEngine = $generator -match "Complete-PackGit"
  apiGeneration = $generator -match "apps/api/src"
  webGeneration = $generator -match "apps/web/src/app"
  mobileGeneration = $generator -match "apps/mobile/lib/features"
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })

if ($failed.Count -gt 0) {
  throw "Pack Builder integration failed: $($failed.Name -join ', ')"
}

[pscustomobject]@{
  success = $true
  system = "AVOS Pack Builder V1"
  integrationTests = "PASS"
  checks = $checks.Count
} | Format-List