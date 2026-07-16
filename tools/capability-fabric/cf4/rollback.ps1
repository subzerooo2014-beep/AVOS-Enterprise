[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
Set-Location $RepoRoot

$intelligenceRoot = Join-Path $RepoRoot "apps/api/src/capability-intelligence"
$toolsRoot = Join-Path $RepoRoot "tools/capability-fabric/cf4"
$docsFile = Join-Path $RepoRoot "docs/architecture/capability-fabric/CF-4-CAPABILITY-INTELLIGENCE.md"
$backupRoot = Join-Path $RepoRoot ".avos/rollback/capability-fabric-cf4"
$appBackup = Join-Path $backupRoot "app.module.ts.before-cf4"
$appModule = Join-Path $RepoRoot "apps/api/src/app.module.ts"

Write-Host "Rolling back AVOS Capability Fabric CF-4..." -ForegroundColor Yellow

if (Test-Path -LiteralPath $appBackup) {
    Copy-Item -LiteralPath $appBackup -Destination $appModule -Force
} else {
    $content = Get-Content -LiteralPath $appModule -Raw
    $content = [regex]::Replace(
        $content,
        '(?m)^import \{ CapabilityIntelligenceModule \} from "\./capability-intelligence/capability-intelligence\.module";\r?\n?',
        ''
    )
    $content = [regex]::Replace(
        $content,
        '(?m)^\s*CapabilityIntelligenceModule,\r?\n?',
        ''
    )
    [System.IO.File]::WriteAllText(
        $appModule,
        $content,
        [System.Text.UTF8Encoding]::new($false)
    )
}

foreach ($path in @($intelligenceRoot, $docsFile)) {
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Recurse -Force
    }
}

if (Test-Path -LiteralPath $backupRoot) {
    Remove-Item -LiteralPath $backupRoot -Recurse -Force
}

Write-Host "CF-4 rollback completed. CF-1, CF-2, CF-3, and all prior AVOS layers were preserved." -ForegroundColor Green

if (Test-Path -LiteralPath $toolsRoot) {
    Remove-Item -LiteralPath $toolsRoot -Recurse -Force
}