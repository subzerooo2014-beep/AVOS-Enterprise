[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
Set-Location $RepoRoot

$reviewRoot = Join-Path $RepoRoot "apps/api/src/capability-fabric-review"
$toolsRoot = Join-Path $RepoRoot "tools/capability-fabric/review"
$docsFile = Join-Path $RepoRoot "docs/architecture/capability-fabric/CAPABILITY-FABRIC-ARCHITECTURE-REVIEW.md"
$backupRoot = Join-Path $RepoRoot ".avos/rollback/capability-fabric-review"
$appBackup = Join-Path $backupRoot "app.module.ts.before-review"
$appModule = Join-Path $RepoRoot "apps/api/src/app.module.ts"

Write-Host "Rolling back Capability Fabric Architecture Review..." -ForegroundColor Yellow

if (Test-Path -LiteralPath $appBackup) {
    Copy-Item -LiteralPath $appBackup -Destination $appModule -Force
} else {
    $content = Get-Content -LiteralPath $appModule -Raw
    $content = [regex]::Replace(
        $content,
        '(?m)^import \{ CapabilityFabricReviewModule \} from "\./capability-fabric-review/capability-fabric-review\.module";\r?\n?',
        ''
    )
    $content = [regex]::Replace(
        $content,
        '(?m)^\s*CapabilityFabricReviewModule,\r?\n?',
        ''
    )
    [System.IO.File]::WriteAllText(
        $appModule,
        $content,
        [System.Text.UTF8Encoding]::new($false)
    )
}

foreach ($path in @($reviewRoot, $docsFile)) {
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Recurse -Force
    }
}

if (Test-Path -LiteralPath $backupRoot) {
    Remove-Item -LiteralPath $backupRoot -Recurse -Force
}

Write-Host "Architecture Review rollback completed. CF-1 through CF-5 were preserved." -ForegroundColor Green

if (Test-Path -LiteralPath $toolsRoot) {
    Remove-Item -LiteralPath $toolsRoot -Recurse -Force
}