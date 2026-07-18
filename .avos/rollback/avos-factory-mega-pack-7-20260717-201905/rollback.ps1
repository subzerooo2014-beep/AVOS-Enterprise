$ErrorActionPreference = "Stop"

$RollbackRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Resolve-Path (Join-Path $RollbackRoot "..\..\..")
$ApiSrc = Join-Path $RepoRoot "apps\api\src"
$TargetModule = Join-Path $ApiSrc "avos-factory-mega-pack-7"
$BackupModule = Join-Path $RollbackRoot "avos-factory-mega-pack-7"
$TargetAppModule = Join-Path $ApiSrc "app.module.ts"
$BackupAppModule = Join-Path $RollbackRoot "app.module.ts"

if (Test-Path $TargetModule) {
    Remove-Item -Path $TargetModule -Recurse -Force
}

if (Test-Path $BackupModule) {
    Copy-Item -Path $BackupModule -Destination $TargetModule -Recurse -Force
}

Copy-Item -Path $BackupAppModule -Destination $TargetAppModule -Force

Write-Host "AVOS Factory Mega Pack 7 rollback completed." -ForegroundColor Green
