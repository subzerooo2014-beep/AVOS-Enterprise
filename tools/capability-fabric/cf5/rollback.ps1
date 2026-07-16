[CmdletBinding()]
param(
    [string]$RepoRoot = "C:\Users\User\Desktop\AVOS"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path
Set-Location $RepoRoot

$enterpriseRoot = Join-Path $RepoRoot "apps/api/src/capability-enterprise"
$toolsRoot = Join-Path $RepoRoot "tools/capability-fabric/cf5"
$docsFile = Join-Path $RepoRoot "docs/architecture/capability-fabric/CF-5-CAPABILITY-ENTERPRISE.md"
$backupRoot = Join-Path $RepoRoot ".avos/rollback/capability-fabric-cf5"
$appBackup = Join-Path $backupRoot "app.module.ts.before-cf5"
$appModule = Join-Path $RepoRoot "apps/api/src/app.module.ts"

Write-Host "Rolling back AVOS Capability Fabric CF-5..." -ForegroundColor Yellow

if (Test-Path -LiteralPath $appBackup) {
    Copy-Item -LiteralPath $appBackup -Destination $appModule -Force
} else {
    $content = Get-Content -LiteralPath $appModule -Raw
    $content = [regex]::Replace(
        $content,
        '(?m)^import \{ CapabilityEnterpriseModule \} from "\./capability-enterprise/capability-enterprise\.module";\r?\n?',
        ''
    )
    $content = [regex]::Replace(
        $content,
        '(?m)^\s*CapabilityEnterpriseModule,\r?\n?',
        ''
    )
    [System.IO.File]::WriteAllText(
        $appModule,
        $content,
        [System.Text.UTF8Encoding]::new($false)
    )
}

foreach ($path in @($enterpriseRoot, $docsFile)) {
    if (Test-Path -LiteralPath $path) {
        Remove-Item -LiteralPath $path -Recurse -Force
    }
}

if (Test-Path -LiteralPath $backupRoot) {
    Remove-Item -LiteralPath $backupRoot -Recurse -Force
}

Write-Host "CF-5 rollback completed. CF-1 through CF-4 and all prior AVOS layers were preserved." -ForegroundColor Green

if (Test-Path -LiteralPath $toolsRoot) {
    Remove-Item -LiteralPath $toolsRoot -Recurse -Force
}