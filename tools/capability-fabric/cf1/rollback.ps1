[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
Set-Location $RepoRoot

$featureRoot = Join-Path $RepoRoot "apps/api/src/capability-fabric"
$toolsRoot = Join-Path $RepoRoot "tools/capability-fabric"
$docsFile = Join-Path $RepoRoot "docs/architecture/capability-fabric/CF-1-CAPABILITY-FOUNDATION.md"
$backupRoot = Join-Path $RepoRoot ".avos/rollback/capability-fabric-cf1"
$appBackup = Join-Path $backupRoot "app.module.ts.before-cf1"
$appModule = Join-Path $RepoRoot "apps/api/src/app.module.ts"

Write-Host "Rolling back AVOS Capability Fabric CF-1..." -ForegroundColor Yellow

if (Test-Path -LiteralPath $appBackup) {
    Copy-Item -LiteralPath $appBackup -Destination $appModule -Force
} else {
    $content = Get-Content -LiteralPath $appModule -Raw
    $content = [regex]::Replace(
        $content,
        '(?m)^import \{ CapabilityFabricModule \} from "\./capability-fabric/capability-fabric\.module";\r?\n?',
        ''
    )
    $content = [regex]::Replace(
        $content,
        '(?m)^\s*CapabilityFabricModule,\r?\n?',
        ''
    )
    [System.IO.File]::WriteAllText(
        $appModule,
        $content,
        [System.Text.UTF8Encoding]::new($false)
    )
}

foreach ($path in @($featureRoot, $docsFile)) {
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Recurse -Force
    }
}

if (Test-Path -LiteralPath $backupRoot) {
    Remove-Item -LiteralPath $backupRoot -Recurse -Force
}

Write-Host "CF-1 rollback completed. Existing Foundation, Kernel, Brain, and Nervous System were not modified." -ForegroundColor Green

if (Test-Path -LiteralPath $toolsRoot) {
    Remove-Item -LiteralPath $toolsRoot -Recurse -Force
}