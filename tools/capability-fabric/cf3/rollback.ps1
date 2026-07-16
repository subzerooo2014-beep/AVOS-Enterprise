[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
Set-Location $RepoRoot

$orchestrationRoot = Join-Path $RepoRoot "apps/api/src/capability-orchestration"
$toolsRoot = Join-Path $RepoRoot "tools/capability-fabric/cf3"
$docsFile = Join-Path $RepoRoot "docs/architecture/capability-fabric/CF-3-CAPABILITY-ORCHESTRATION.md"
$backupRoot = Join-Path $RepoRoot ".avos/rollback/capability-fabric-cf3"
$appBackup = Join-Path $backupRoot "app.module.ts.before-cf3"
$appModule = Join-Path $RepoRoot "apps/api/src/app.module.ts"

Write-Host "Rolling back AVOS Capability Fabric CF-3..." -ForegroundColor Yellow

if (Test-Path -LiteralPath $appBackup) {
    Copy-Item -LiteralPath $appBackup -Destination $appModule -Force
} else {
    $content = Get-Content -LiteralPath $appModule -Raw
    $content = [regex]::Replace(
        $content,
        '(?m)^import \{ CapabilityOrchestrationModule \} from "\./capability-orchestration/capability-orchestration\.module";\r?\n?',
        ''
    )
    $content = [regex]::Replace(
        $content,
        '(?m)^\s*CapabilityOrchestrationModule,\r?\n?',
        ''
    )
    [System.IO.File]::WriteAllText(
        $appModule,
        $content,
        [System.Text.UTF8Encoding]::new($false)
    )
}

foreach ($path in @($orchestrationRoot, $docsFile)) {
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Recurse -Force
    }
}

if (Test-Path -LiteralPath $backupRoot) {
    Remove-Item -LiteralPath $backupRoot -Recurse -Force
}

Write-Host "CF-3 rollback completed. CF-1, CF-2, and all prior AVOS layers were preserved." -ForegroundColor Green

if (Test-Path -LiteralPath $toolsRoot) {
    Remove-Item -LiteralPath $toolsRoot -Recurse -Force
}