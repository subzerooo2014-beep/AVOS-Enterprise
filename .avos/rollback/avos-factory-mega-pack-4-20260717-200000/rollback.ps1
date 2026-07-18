$ErrorActionPreference = "Stop"

$RollbackRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $RollbackRoot "..\..\..")
$ApiSrc = Join-Path $RepoRoot "apps\api\src"
$TargetModule = Join-Path $ApiSrc "avos-factory-mega-pack-4"
$BackupModule = Join-Path $RollbackRoot "avos-factory-mega-pack-4"
$BackupAppModule = Join-Path $RollbackRoot "app.module.ts"
$TargetAppModule = Join-Path $ApiSrc "app.module.ts"

if (Test-Path $TargetModule) {
    Remove-Item -Path $TargetModule -Recurse -Force
}

if (Test-Path $BackupModule) {
    Copy-Item -Path $BackupModule -Destination $TargetModule -Recurse -Force
}

Copy-Item -Path $BackupAppModule -Destination $TargetAppModule -Force

Write-Host "AVOS Factory Mega Pack 4 rollback completed." -ForegroundColor Green
