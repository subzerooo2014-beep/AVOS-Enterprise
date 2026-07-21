param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "AVOS-SDOS-Pipeline.Common.ps1")

Write-Section "AVOS SDOS Pipeline v2 — Pack 02 Generator Validation"

$repoRoot = Resolve-AvosRepoRoot
$state = Read-SdosState -RepoRoot $repoRoot

Assert-SdosGate -State $state -Gate "foundation"

$packRoot = Join-Path $state.apiRoot "src\avos-software-development-os\ultimate-mega-pack"

$requiredFiles = @(
    (Join-Path $packRoot "software-development-os-ultimate.module.ts"),
    (Join-Path $packRoot "software-development-os-ultimate.controller.ts"),
    (Join-Path $packRoot "software-development-os-ultimate-orchestrator.service.ts"),
    (Join-Path $packRoot "ultimate-mega-pack.types.ts")
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        throw "Required SDOS artifact missing: $file"
    }
}

$domainDirectories = @(Get-ChildItem $packRoot -Directory)

if ($domainDirectories.Count -lt 9) {
    throw "Expected at least 9 SDOS domain directories; found $($domainDirectories.Count)."
}

Set-SdosGate -State $state -Gate "generated" -Value $true
Save-SdosState -RepoRoot $repoRoot -State $state

Write-Host "Generator artifacts validated." -ForegroundColor Green
Write-Host "Next: Pack 03" -ForegroundColor Cyan
