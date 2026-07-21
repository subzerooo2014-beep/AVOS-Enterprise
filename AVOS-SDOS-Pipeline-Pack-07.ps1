param(
    [switch]$Push,
    [string]$Branch = "feature/services-platform-v2",
    [string]$CommitMessage = "feat(api): certify AVOS Software Development OS ultimate"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "AVOS-SDOS-Pipeline.Common.ps1")

Write-Section "AVOS SDOS Pipeline v2 — Pack 07 Git"

$repoRoot = Resolve-AvosRepoRoot
$state = Read-SdosState -RepoRoot $repoRoot

Assert-SdosGate -State $state -Gate "certified"

$paths = @(
    "apps/api/src/app.module.ts",
    "apps/api/src/avos-software-development-os/avos-software-development-os.module.ts",
    "apps/api/src/avos-software-development-os/ultimate-mega-pack",
    "AVOS-SDOS-Pipeline.Common.ps1",
    "AVOS-SDOS-Pipeline-Pack-01.ps1",
    "AVOS-SDOS-Pipeline-Pack-02.ps1",
    "AVOS-SDOS-Pipeline-Pack-03.ps1",
    "AVOS-SDOS-Pipeline-Pack-04.ps1",
    "AVOS-SDOS-Pipeline-Pack-05.ps1",
    "AVOS-SDOS-Pipeline-Pack-06.ps1",
    "AVOS-SDOS-Pipeline-Pack-07.ps1"
)

$existingPaths = @(
    $paths | Where-Object {
        Test-Path (Join-Path $repoRoot $_)
    }
)

if ($existingPaths.Count -lt 3) {
    throw "Expected SDOS project files were not found."
}

Push-Location $repoRoot

try {
    & git add -- $existingPaths

    if ($LASTEXITCODE -ne 0) {
        throw "git add failed."
    }

    $stagedFiles = @(git diff --cached --name-only)

    if ($LASTEXITCODE -ne 0) {
        throw "git diff --cached failed."
    }

    if ($stagedFiles.Count -eq 0) {
        throw "No verified changes were staged."
    }

    $stagedFiles |
        Set-Content (Join-Path $state.reportRoot "staged-files.txt") -Encoding UTF8

    git commit -m $CommitMessage

    if ($LASTEXITCODE -ne 0) {
        throw "git commit failed."
    }

    $commitHash = (git rev-parse --short HEAD).Trim()

    if ($Push) {
        git push origin $Branch

        if ($LASTEXITCODE -ne 0) {
            throw "git push failed."
        }
    }
}
finally {
    Pop-Location
}

$state.commitHash = $commitHash
$state.pushed = [bool]$Push

Set-SdosGate -State $state -Gate "committed" -Value $true
Save-SdosState -RepoRoot $repoRoot -State $state

$summary = [ordered]@{
    name               = $state.name
    version            = $state.version
    status             = "completed"
    gates              = $state.gates
    certificationScore = $state.certificationScore
    approvedBy         = $state.approvedBy
    commitHash         = $state.commitHash
    pushed             = $state.pushed
    reportRoot         = $state.reportRoot
    backupRoot         = $state.backupRoot
}

$summary |
    ConvertTo-Json -Depth 30 |
    Set-Content (Join-Path $state.reportRoot "summary.json") -Encoding UTF8

$summary | Format-List

Write-Host "AVOS SDOS Pipeline v2 completed successfully." -ForegroundColor Green
