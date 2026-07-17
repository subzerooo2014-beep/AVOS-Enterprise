param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
$dna = Join-Path $RepoRoot "apps/api/src/digital-dna"
$backup = Join-Path $RepoRoot ".avos/rollback/digital-dna-final-mega-bundle/app.module.ts.before-digital-dna"
$app = Join-Path $RepoRoot "apps/api/src/app.module.ts"

Remove-Item $dna -Recurse -Force -ErrorAction SilentlyContinue

if (Test-Path -LiteralPath $backup) {
    Copy-Item $backup $app -Force
}

Write-Host "AVOS Digital DNA rollback completed." -ForegroundColor Green