param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

. (Join-Path $PSScriptRoot "AVOS-SDOS-Pipeline.Common.ps1")

Write-Section "AVOS SDOS Pipeline v2 — Pack 04 Verification"

$repoRoot = Resolve-AvosRepoRoot
$state = Read-SdosState -RepoRoot $repoRoot

Assert-SdosGate -State $state -Gate "registered"

Invoke-CheckedProcess `
    -WorkingDirectory $state.apiRoot `
    -FilePath "pnpm.cmd" `
    -Arguments @("exec","tsc","--noEmit","-p","tsconfig.build.json") `
    -StdOutPath (Join-Path $state.reportRoot "typescript.stdout.log") `
    -StdErrPath (Join-Path $state.reportRoot "typescript.stderr.log")

Invoke-CheckedProcess `
    -WorkingDirectory $state.apiRoot `
    -FilePath "pnpm.cmd" `
    -Arguments @("build") `
    -StdOutPath (Join-Path $state.reportRoot "build.stdout.log") `
    -StdErrPath (Join-Path $state.reportRoot "build.stderr.log")

Set-SdosGate -State $state -Gate "verified" -Value $true
Save-SdosState -RepoRoot $repoRoot -State $state

Write-Host "TypeScript and NestJS build passed." -ForegroundColor Green
Write-Host "Next: start server, then Pack 05" -ForegroundColor Cyan
