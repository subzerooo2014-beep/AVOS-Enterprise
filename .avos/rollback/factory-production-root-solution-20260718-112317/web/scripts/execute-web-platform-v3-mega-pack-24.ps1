$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 mega pack 24"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot

if ((git branch --show-current).Trim() -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch'."
}

$requiredFiles = @(
  "apps/web/src/app/service-health-observability/page.tsx",
  "apps/web/src/components/service-health-observability/service-health-observability-center.tsx",
  "apps/web/src/components/service-health-observability/service-health-observability.module.css",
  "apps/web/src/data/service-health-observability.ts",
  "apps/web/src/store/service-health-observability-store.ts",
  "apps/web/scripts/verify-web-platform-v3-mega-pack-24.mjs",
  "apps/web/scripts/smoke-web-platform-v3-mega-pack-24.mjs",
  "apps/web/scripts/execute-web-platform-v3-mega-pack-24.ps1"
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
    throw "Mega Pack 24 build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-web-platform-v3-mega-pack-24.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 24 verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-mega-pack-24.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 24 smoke test failed."
}
$smoke = $smokeJson | ConvertFrom-Json
$smoke | Format-List

Set-Location $RepoRoot

git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "Unable to stage Mega Pack 24 files."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    throw "Git validation failed."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 24 commit failed."
}

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "Mega Pack 24 push failed."
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
  megaPack = "Mega Pack 24"
  version = "3.24.0"
  branch = $ExpectedBranch
  commit = (git rev-parse --short HEAD).Trim()
  services = $smoke.services
  domains = $smoke.domains
  qualityScore = $smoke.qualityScore
  healthStatus = $smoke.healthStatus
  webServerRestarted = $true
  page = "http://localhost:3001/service-health-observability"
} | Format-List
