$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 mega pack 18"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot

if ((git branch --show-current).Trim() -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch'."
}

$requiredFiles = @(
  "apps/web/src/app/ai-command-center/page.tsx",
  "apps/web/src/components/ai-command-center/ai-command-center.tsx",
  "apps/web/src/components/ai-command-center/ai-command-center.module.css",
  "apps/web/src/data/ai-command-center.ts",
  "apps/web/src/store/ai-command-center-store.ts",
  "apps/web/scripts/verify-web-platform-v3-mega-pack-18.mjs",
  "apps/web/scripts/smoke-web-platform-v3-mega-pack-18.mjs",
  "apps/web/scripts/execute-web-platform-v3-mega-pack-18.ps1"
)

Set-Location $WebRoot

Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue

pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 18 build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-web-platform-v3-mega-pack-18.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 18 verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-mega-pack-18.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 18 smoke test failed."
}
$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

Set-Location $RepoRoot

git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "Unable to stage Mega Pack 18 files."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    throw "Git validation failed."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 18 commit failed."
}

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 18 push failed."
}

[PSCustomObject]@{
  success = $true
  system = "AVOS Web Platform V3"
  megaPack = "Mega Pack 18"
  version = "3.18.0"
  branch = $ExpectedBranch
  commit = (git rev-parse --short HEAD).Trim()
  recommendations = $smoke.recommendations
  alerts = $smoke.alerts
  agenda = $smoke.agenda
  qualityScore = $smoke.qualityScore
  healthStatus = $smoke.healthStatus
} | Format-List
