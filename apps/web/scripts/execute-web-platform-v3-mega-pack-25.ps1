$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 mega pack 25"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot

if ((git branch --show-current).Trim() -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch'."
}

$requiredFiles = @(
  "apps/web/src/app/capacity-demand-intelligence/page.tsx",
  "apps/web/src/components/capacity-demand-intelligence/capacity-demand-intelligence-center.tsx",
  "apps/web/src/components/capacity-demand-intelligence/capacity-demand-intelligence.module.css",
  "apps/web/src/data/capacity-demand-intelligence.ts",
  "apps/web/src/store/capacity-demand-intelligence-store.ts",
  "apps/web/scripts/verify-web-platform-v3-mega-pack-25.mjs",
  "apps/web/scripts/smoke-web-platform-v3-mega-pack-25.mjs",
  "apps/web/scripts/execute-web-platform-v3-mega-pack-25.ps1"
)

Set-Location $WebRoot

$portProcessIds = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $portProcessIds) {
  Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
}

Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue

pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 25 build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-web-platform-v3-mega-pack-25.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 25 verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-mega-pack-25.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 25 smoke test failed."
}
$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

Set-Location $RepoRoot

git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "Unable to stage Mega Pack 25 files."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    throw "Git validation failed."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 25 commit failed."
}

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 25 push failed."
}

Start-Process `
  -FilePath "pnpm.cmd" `
  -ArgumentList "dev" `
  -WorkingDirectory $WebRoot `
  -WindowStyle Normal

Start-Sleep -Seconds 4

[PSCustomObject]@{
  success = $true
  system = "AVOS Web Platform V3"
  megaPack = "Mega Pack 25"
  version = "3.25.0"
  branch = $ExpectedBranch
  commit = (git rev-parse --short HEAD).Trim()
  records = $smoke.records
  regions = $smoke.regions
  qualityScore = $smoke.qualityScore
  healthStatus = $smoke.healthStatus
  webServerRestarted = $true
  page = "http://localhost:3001/capacity-demand-intelligence"
} | Format-List
