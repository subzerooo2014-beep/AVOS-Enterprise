param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
$genome = Join-Path $RepoRoot "apps/api/src/digital-genome"
$backup = Join-Path $RepoRoot ".avos/rollback/digital-genome-final-mega-bundle/app.module.ts.before-digital-genome"
$app = Join-Path $RepoRoot "apps/api/src/app.module.ts"

Remove-Item $genome -Recurse -Force -ErrorAction SilentlyContinue

if (Test-Path -LiteralPath $backup) {
    Copy-Item $backup $app -Force
}

Write-Host "AVOS Digital Genome rollback completed." -ForegroundColor Green