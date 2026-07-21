param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "AVOS-SDOS-Pipeline.Common.ps1")

Write-Section "AVOS SDOS Pipeline v2 — Pack 03 Registration"

$repoRoot = Resolve-AvosRepoRoot
$state = Read-SdosState -RepoRoot $repoRoot

Assert-SdosGate -State $state -Gate "generated"

$parentModule = Join-Path $state.apiRoot "src\avos-software-development-os\avos-software-development-os.module.ts"
$appModule = Join-Path $state.apiRoot "src\app.module.ts"

Add-NestImportSafely `
    -ModuleFile $parentModule `
    -ClassName "SoftwareDevelopmentOsUltimateModule" `
    -ImportPath "./ultimate-mega-pack/software-development-os-ultimate.module"

Add-NestImportSafely `
    -ModuleFile $appModule `
    -ClassName "AvosSoftwareDevelopmentOsModule" `
    -ImportPath "./avos-software-development-os/avos-software-development-os.module"

Set-SdosGate -State $state -Gate "registered" -Value $true
Save-SdosState -RepoRoot $repoRoot -State $state

Write-Host "Registration completed." -ForegroundColor Green
Write-Host "Next: Pack 04" -ForegroundColor Cyan
