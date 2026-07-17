param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
$engine = Join-Path $RepoRoot "apps/api/src/architecture-intelligence-engine"
$backup = Join-Path $RepoRoot ".avos/rollback/architecture-intelligence-engine-final-mega-bundle/app.module.ts.before-architecture-intelligence"
$app = Join-Path $RepoRoot "apps/api/src/app.module.ts"
Remove-Item $engine -Recurse -Force -ErrorAction SilentlyContinue
if (Test-Path -LiteralPath $backup) {
    Copy-Item $backup $app -Force
}
Write-Host "AVOS Architecture Intelligence Engine rollback completed." -ForegroundColor Green