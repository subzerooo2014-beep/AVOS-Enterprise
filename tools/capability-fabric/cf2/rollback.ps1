[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
Set-Location $RepoRoot

$runtimeRoot = Join-Path $RepoRoot "apps/api/src/capability-runtime"
$toolsRoot = Join-Path $RepoRoot "tools/capability-fabric/cf2"
$docsFile = Join-Path $RepoRoot "docs/architecture/capability-fabric/CF-2-CAPABILITY-RUNTIME.md"
$backupRoot = Join-Path $RepoRoot ".avos/rollback/capability-fabric-cf2"
$appBackup = Join-Path $backupRoot "app.module.ts.before-cf2"
$appModule = Join-Path $RepoRoot "apps/api/src/app.module.ts"

Write-Host "Rolling back AVOS Capability Fabric CF-2..." -ForegroundColor Yellow

if (Test-Path -LiteralPath $appBackup) {
    Copy-Item -LiteralPath $appBackup -Destination $appModule -Force
} else {
    $content = Get-Content -LiteralPath $appModule -Raw
    $content = [regex]::Replace(
        $content,
        '(?m)^import \{ CapabilityRuntimeModule \} from "\./capability-runtime/capability-runtime\.module";\r?\n?',
        ''
    )
    $content = [regex]::Replace(
        $content,
        '(?m)^\s*CapabilityRuntimeModule,\r?\n?',
        ''
    )
    [System.IO.File]::WriteAllText(
        $appModule,
        $content,
        [System.Text.UTF8Encoding]::new($false)
    )
}

foreach ($path in @($runtimeRoot, $docsFile)) {
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Recurse -Force
    }
}

if (Test-Path -LiteralPath $backupRoot) {
    Remove-Item -LiteralPath $backupRoot -Recurse -Force
}

Write-Host "CF-2 rollback completed. CF-1 and all previous AVOS layers were preserved." -ForegroundColor Green

if (Test-Path -LiteralPath $toolsRoot) {
    Remove-Item -LiteralPath $toolsRoot -Recurse -Force
}