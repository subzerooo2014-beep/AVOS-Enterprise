param(
    [switch]$AllowDirtyWorkingTree
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "AVOS-SDOS-Pipeline.Common.ps1")

Write-Section "AVOS SDOS Pipeline v2 — Pack 01 Foundation"

$repoRoot = Resolve-AvosRepoRoot
$runId = Get-Date -Format "yyyyMMdd-HHmmss"

$pipelineRoot = Get-SdosPipelineRoot -RepoRoot $repoRoot
$reportRoot = Join-Path $repoRoot ".avos\reports\sdos-pipeline-v2-$runId"
$backupRoot = Join-Path $repoRoot ".avos\rollback\sdos-pipeline-v2-$runId"

New-Item -ItemType Directory -Path $pipelineRoot -Force | Out-Null
New-Item -ItemType Directory -Path $reportRoot -Force | Out-Null
New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null

$state = [pscustomobject]@{
    name               = "AVOS SDOS Pipeline v2 Production"
    version            = "SDOS-PIPELINE-2.0.0"
    runId              = $runId
    repoRoot           = $repoRoot
    apiRoot            = (Join-Path $repoRoot "apps\api")
    reportRoot         = $reportRoot
    backupRoot         = $backupRoot
    baseUrl            = "http://localhost:3000"
    baseRoute          = "avos/software-development-os"
    approvedBy         = $null
    certificationScore = $null
    commitHash         = $null
    pushed             = $false
    gates              = [pscustomobject]@{
        foundation = $true
        generated  = $false
        registered = $false
        verified   = $false
        runtime    = $false
        certified  = $false
        committed  = $false
    }
    createdAt          = (Get-Date).ToString("o")
    updatedAt          = (Get-Date).ToString("o")
}

Save-SdosState -RepoRoot $repoRoot -State $state

Write-Host "Foundation initialized." -ForegroundColor Green
Write-Host "Next: Pack 02" -ForegroundColor Cyan
