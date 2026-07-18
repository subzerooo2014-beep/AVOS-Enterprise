$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 mega packs 39-43 bundle"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot

if ((git branch --show-current).Trim() -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch'."
}

$requiredFiles = @(
  "apps/web/src/app/security-threat-center/page.tsx",
  "apps/web/src/app/customer-experience-command/page.tsx",
  "apps/web/src/app/sustainability-impact-center/page.tsx",
  "apps/web/src/app/market-expansion-center/page.tsx",
  "apps/web/src/app/commercial-launch-readiness/page.tsx",
  "apps/web/src/components/enterprise-bundle-39-43/enterprise-bundle-center.tsx",
  "apps/web/src/components/enterprise-bundle-39-43/enterprise-bundle-center.module.css",
  "apps/web/src/data/enterprise-bundle-39-43.ts",
  "apps/web/scripts/verify-web-platform-v3-mega-packs-39-43.mjs",
  "apps/web/scripts/smoke-web-platform-v3-mega-packs-39-43.mjs",
  "apps/web/scripts/execute-web-platform-v3-mega-packs-39-43.ps1"
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
    throw "Mega Packs 39-43 build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-web-platform-v3-mega-packs-39-43.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Packs 39-43 verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-mega-packs-39-43.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Packs 39-43 smoke test failed."
}
$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

Set-Location $RepoRoot

git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "Unable to stage bundle files."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    throw "Git validation failed."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "Bundle commit failed."
}

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "Bundle push failed."
}

[PSCustomObject]@{
  success = $true
  system = "AVOS Web Platform V3"
  bundle = "Mega Packs 39-43"
  version = "3.43.0"
  branch = $ExpectedBranch
  commit = (git rev-parse --short HEAD).Trim()
  centers = $smoke.centers
  records = $smoke.records
  qualityScore = $smoke.qualityScore
  healthStatus = $smoke.healthStatus
} | Format-List
