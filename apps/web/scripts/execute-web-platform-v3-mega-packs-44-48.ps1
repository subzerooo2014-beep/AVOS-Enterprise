$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v3 mega packs 44-48 bundle"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path
Set-Location $RepoRoot
if ((git branch --show-current).Trim() -ne $ExpectedBranch) { throw "Expected branch '$ExpectedBranch'." }
$requiredFiles = @(
  "apps/web/src/app/sovereign-intelligence-center/page.tsx",
  "apps/web/src/app/autonomous-operations-center/page.tsx",
  "apps/web/src/app/digital-twin-command/page.tsx",
  "apps/web/src/app/innovation-venture-lab/page.tsx",
  "apps/web/src/app/ecosystem-economy-center/page.tsx",
  "apps/web/src/components/enterprise-bundle-44-48/enterprise-bundle-center.tsx",
  "apps/web/src/components/enterprise-bundle-44-48/enterprise-bundle-center.module.css",
  "apps/web/src/data/enterprise-bundle-44-48.ts",
  "apps/web/scripts/verify-web-platform-v3-mega-packs-44-48.mjs",
  "apps/web/scripts/smoke-web-platform-v3-mega-packs-44-48.mjs",
  "apps/web/scripts/execute-web-platform-v3-mega-packs-44-48.ps1"
)
foreach ($file in $requiredFiles) { if (-not (Test-Path $file)) { throw "Missing required file: $file" } }
Set-Location $WebRoot
$portProcessIds = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($processId in $portProcessIds) { Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue }
Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue
pnpm build
if ($LASTEXITCODE -ne 0) { throw "Mega Packs 44-48 build failed." }
$verificationJson = & node (Join-Path $ScriptRoot "verify-web-platform-v3-mega-packs-44-48.mjs")
if ($LASTEXITCODE -ne 0) { throw "Mega Packs 44-48 verification failed." }
$verificationJson | ConvertFrom-Json | Format-List
$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v3-mega-packs-44-48.mjs")
if ($LASTEXITCODE -ne 0) { throw "Mega Packs 44-48 smoke test failed." }
$smokeJson | ConvertFrom-Json | Format-List
Set-Location $RepoRoot
git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) { throw "git add failed." }
git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) { throw "git commit failed." }
git push
if ($LASTEXITCODE -ne 0) { throw "git push failed." }
Write-Host "Mega Packs 44-48 completed successfully." -ForegroundColor Green
