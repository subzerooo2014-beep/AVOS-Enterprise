$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 mega pack 14"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot
if ((git branch --show-current).Trim() -ne $ExpectedBranch) {
    throw "Wrong branch."
}

$requiredFiles = @(
  "apps/web/src/app/enterprise-settings/page.tsx",
  "apps/web/src/components/enterprise-settings/enterprise-settings-center.tsx",
  "apps/web/src/components/enterprise-settings/enterprise-settings.module.css",
  "apps/web/src/data/enterprise-settings.ts",
  "apps/web/src/store/enterprise-settings-store.ts",
  "apps/web/scripts/verify-web-platform-v3-mega-pack-14.mjs",
  "apps/web/scripts/smoke-web-platform-v3-mega-pack-14.mjs",
  "apps/web/scripts/execute-web-platform-v3-mega-pack-14.ps1"
)

Set-Location $WebRoot
pnpm build
if ($LASTEXITCODE -ne 0) { throw "Build failed." }

$verify = & node (Join-Path $ScriptRoot "verify-web-platform-v3-mega-pack-14.mjs")
if ($LASTEXITCODE -ne 0) { throw "Verification failed." }
$verify | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-mega-pack-14.mjs")
if ($LASTEXITCODE -ne 0) { throw "Smoke failed." }
$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

Set-Location $RepoRoot
git add -- $requiredFiles
git diff --cached --check
if ($LASTEXITCODE -ne 0) { throw "Git validation failed." }

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) { throw "Commit failed." }

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) { throw "Push failed." }

[PSCustomObject]@{
  success = $true
  system = "AVOS Web Platform V3"
  megaPack = "Mega Pack 14"
  version = "3.14.0"
  commit = (git rev-parse --short HEAD).Trim()
  settings = $smoke.settings
  qualityScore = $smoke.qualityScore
  healthStatus = $smoke.healthStatus
} | Format-List
