$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(api): core application flows v1 ultra bundle f mega packs 101-125"
$ScriptRoot = $PSScriptRoot
$ApiRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $ApiRoot "..\..")).Path

Set-Location $RepoRoot

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but found '$currentBranch'."
}

$requiredFiles = @(
    "apps/api/src/core-application-flows/core-flow-intelligence.types.ts",
    "apps/api/src/core-application-flows/core-flow-anomaly.service.ts",
    "apps/api/src/core-application-flows/core-flow-recommendation.service.ts",
    "apps/api/src/core-application-flows/core-flow-forecast.service.ts",
    "apps/api/src/core-application-flows/core-flow-optimization.service.ts",
    "apps/api/src/core-application-flows/core-flow-learning.service.ts",
    "apps/api/src/core-application-flows/core-flow-intelligence.service.ts",
    "apps/api/src/core-application-flows/core-flow-intelligence.controller.ts",
    "apps/api/src/workflows/workflows.module.ts",
    "apps/api/scripts/verify-core-application-flows-v1-ultra-bundle-f-101-125.mjs",
    "apps/api/scripts/smoke-core-application-flows-v1-ultra-bundle-f-101-125.mjs",
    "apps/api/scripts/execute-core-application-flows-v1-ultra-bundle-f-101-125.ps1"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        throw "Missing required file: $file"
    }
}

Set-Location $ApiRoot

pnpm prisma generate
if ($LASTEXITCODE -ne 0) {
    throw "Prisma Client generation failed."
}

pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Core Application Flows Ultra Bundle F build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-core-application-flows-v1-ultra-bundle-f-101-125.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle F verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-core-application-flows-v1-ultra-bundle-f-101-125.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle F smoke test failed."
}
$smokeJson | ConvertFrom-Json | Format-List

Set-Location $RepoRoot

git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "git add failed."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    throw "Git staged validation failed."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "git commit failed."
}

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "git push failed."
}

Write-Host "Core Application Flows Ultra Bundle F Mega Packs 101-125 completed successfully." -ForegroundColor Green
Write-Host "Restart API manually with: pnpm --filter api start:dev" -ForegroundColor Yellow
