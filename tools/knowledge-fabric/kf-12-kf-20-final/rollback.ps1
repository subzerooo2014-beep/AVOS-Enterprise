param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$root = (Resolve-Path -LiteralPath $RepoRoot).Path
$knowledge = Join-Path $root "apps/api/src/knowledge-fabric"
$backup = Join-Path $root ".avos/rollback/knowledge-fabric-kf-12-kf-20-final"
foreach ($directory in @("capital","trust","security","compliance","analytics","automation","orchestration","platform","certification")) {
    Remove-Item (Join-Path $knowledge $directory) -Recurse -Force -ErrorAction SilentlyContinue
}
Copy-Item (Join-Path $backup "knowledge-fabric.module.ts.before-final-bundle") (Join-Path $knowledge "knowledge-fabric.module.ts") -Force
Copy-Item (Join-Path $backup "index.ts.before-final-bundle") (Join-Path $knowledge "index.ts") -Force
Write-Host "KF-12 through KF-20 rollback completed." -ForegroundColor Green