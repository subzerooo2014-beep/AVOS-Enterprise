$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 mega pack 21"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot

if ((git branch --show-current).Trim() -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch'."
}

$requiredFiles = @(
  "apps/web/src/app/recovery-resilience-center/page.tsx",
  "apps/web/src/components/recovery-resilience-center/recovery-resilience-center.tsx",
  "apps/web/src/components/recovery-resilience-center/recovery-resilience-center.module.css",
  "apps/web/src/data/recovery-resilience-center.ts",
  "apps/web/src/store/recovery-resilience-center-store.ts",
  "apps/web/scripts/verify-web-platform-v3-mega-pack-21.mjs",
  "apps/web/scripts/smoke-web-platform-v3-mega-pack-21.mjs",
  "apps/web/scripts/execute-web-platform-v3-mega-pack-21.ps1"
)

Set-Location $WebRoot

Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue

pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 21 build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-web-platform-v3-mega-pack-21.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 21 verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-mega-pack-21.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 21 smoke test failed."
}
$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

Set-Location $RepoRoot

git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "Unable to stage Mega Pack 21 files."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    throw "Git validation failed."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 21 commit failed."
}

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 21 push failed."
}

[PSCustomObject]@{
  success = $true
  system = "AVOS Web Platform V3"
  megaPack = "Mega Pack 21"
  version = "3.21.0"
  branch = $ExpectedBranch
  commit = (git rev-parse --short HEAD).Trim()
  scenarios = $smoke.scenarios
  services = $smoke.services
  qualityScore = $smoke.qualityScore
  healthStatus = $smoke.healthStatus
} | Format-List
