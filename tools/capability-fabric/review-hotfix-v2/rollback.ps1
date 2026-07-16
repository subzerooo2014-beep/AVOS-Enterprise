[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
Set-Location $RepoRoot

$backupRoot = Join-Path $RepoRoot ".avos/rollback/capability-fabric-review-hotfix-v2"
$scannerBackup = Join-Path $backupRoot "capability-fabric-scanner.service.ts.before-hotfix-v2"
$serviceBackup = Join-Path $backupRoot "capability-fabric-review.service.ts.before-hotfix-v2"
$scannerPath = Join-Path $RepoRoot "apps/api/src/capability-fabric-review/capability-fabric-scanner.service.ts"
$servicePath = Join-Path $RepoRoot "apps/api/src/capability-fabric-review/capability-fabric-review.service.ts"
$toolsRoot = Join-Path $RepoRoot "tools/capability-fabric/review-hotfix-v2"

Write-Host "Rolling back Capability Fabric Architecture Review Hotfix V2..." -ForegroundColor Yellow

if (Test-Path -LiteralPath $scannerBackup) {
    Copy-Item -LiteralPath $scannerBackup -Destination $scannerPath -Force
}

if (Test-Path -LiteralPath $serviceBackup) {
    Copy-Item -LiteralPath $serviceBackup -Destination $servicePath -Force
}

if (Test-Path -LiteralPath $backupRoot) {
    Remove-Item -LiteralPath $backupRoot -Recurse -Force
}

Write-Host "Hotfix V2 rollback completed. CF-1 through CF-5 were preserved." -ForegroundColor Green

if (Test-Path -LiteralPath $toolsRoot) {
    Remove-Item -LiteralPath $toolsRoot -Recurse -Force
}
