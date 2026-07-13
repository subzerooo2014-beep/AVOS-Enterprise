$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(api): core application flows v1 mega packs 6-10"
$ScriptRoot = $PSScriptRoot
$ApiRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $ApiRoot "..\..")).Path

Set-Location $RepoRoot
$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but found '$currentBranch'."
}

$requiredFiles = @(
    "apps/api/src/inventory/inventory.module.ts",
    "apps/api/src/inventory/inventory.controller.ts",
    "apps/api/src/inventory/inventory.service.ts",
    "apps/api/src/sales/sales.module.ts",
    "apps/api/src/sales/sales.controller.ts",
    "apps/api/src/sales/sales.service.ts",
    "apps/api/scripts/verify-core-application-flows-v1-mega-packs-6-10.mjs",
    "apps/api/scripts/smoke-core-application-flows-v1-mega-packs-6-10.mjs",
    "apps/api/scripts/execute-core-application-flows-v1-mega-packs-6-10.ps1"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) { throw "Missing required file: $file" }
}

Set-Location $ApiRoot
pnpm prisma generate
if ($LASTEXITCODE -ne 0) { throw "Prisma Client generation failed." }

pnpm build
if ($LASTEXITCODE -ne 0) { throw "Core Application Flows V1 Mega Packs 6-10 build failed." }

$verificationJson = & node (Join-Path $ScriptRoot "verify-core-application-flows-v1-mega-packs-6-10.mjs")
if ($LASTEXITCODE -ne 0) { throw "Verification failed." }
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-core-application-flows-v1-mega-packs-6-10.mjs")
if ($LASTEXITCODE -ne 0) { throw "Smoke test failed." }
$smokeJson | ConvertFrom-Json | Format-List

Set-Location $RepoRoot
git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) { throw "git add failed." }

git diff --cached --check
if ($LASTEXITCODE -ne 0) { throw "Git staged validation failed." }

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) { throw "git commit failed." }

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) { throw "git push failed." }

Write-Host "Core Application Flows V1 Mega Packs 6-10 completed successfully." -ForegroundColor Green
Write-Host "Restart API manually with: pnpm --filter api start:dev" -ForegroundColor Yellow
