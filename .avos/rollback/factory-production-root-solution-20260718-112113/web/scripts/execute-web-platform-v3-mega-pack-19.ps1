$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 mega pack 19"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot

if ((git branch --show-current).Trim() -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch'."
}

$requiredFiles = @(
  "apps/web/src/app/priority-focus-center/page.tsx",
  "apps/web/src/components/priority-focus-center/priority-focus-center.tsx",
  "apps/web/src/components/priority-focus-center/priority-focus-center.module.css",
  "apps/web/src/data/priority-focus-center.ts",
  "apps/web/src/store/priority-focus-center-store.ts",
  "apps/web/scripts/verify-web-platform-v3-mega-pack-19.mjs",
  "apps/web/scripts/smoke-web-platform-v3-mega-pack-19.mjs",
  "apps/web/scripts/execute-web-platform-v3-mega-pack-19.ps1"
)

Set-Location $WebRoot

Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue

pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 19 build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-web-platform-v3-mega-pack-19.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 19 verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-mega-pack-19.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 19 smoke test failed."
}
$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

Set-Location $RepoRoot

git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "Unable to stage Mega Pack 19 files."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    throw "Git validation failed."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 19 commit failed."
}

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 19 push failed."
}

[PSCustomObject]@{
  success = $true
  system = "AVOS Web Platform V3"
  megaPack = "Mega Pack 19"
  version = "3.19.0"
  branch = $ExpectedBranch
  commit = (git rev-parse --short HEAD).Trim()
  priorities = $smoke.priorities
  categories = $smoke.categories
  qualityScore = $smoke.qualityScore
  healthStatus = $smoke.healthStatus
} | Format-List
