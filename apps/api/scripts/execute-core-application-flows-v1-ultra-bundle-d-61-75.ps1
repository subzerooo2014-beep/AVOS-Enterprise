$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(api): core application flows v1 ultra bundle d mega packs 61-75"
$ScriptRoot = $PSScriptRoot
$ApiRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $ApiRoot "..\..")).Path

Set-Location $RepoRoot

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but found '$currentBranch'."
}

$requiredFiles = @(
    "apps/api/src/core-application-flows/core-flow-governance.types.ts",
    "apps/api/src/core-application-flows/core-flow-risk.service.ts",
    "apps/api/src/core-application-flows/core-flow-policy-engine.service.ts",
    "apps/api/src/core-application-flows/core-flow-compliance.service.ts",
    "apps/api/src/core-application-flows/core-flow-escalation.service.ts",
    "apps/api/src/core-application-flows/core-flow-governance.service.ts",
    "apps/api/src/core-application-flows/core-flow-governance.controller.ts",
    "apps/api/src/workflows/workflows.module.ts",
    "apps/api/scripts/verify-core-application-flows-v1-ultra-bundle-d-61-75.mjs",
    "apps/api/scripts/smoke-core-application-flows-v1-ultra-bundle-d-61-75.mjs",
    "apps/api/scripts/execute-core-application-flows-v1-ultra-bundle-d-61-75.ps1"
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
    throw "Core Application Flows Ultra Bundle D build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-core-application-flows-v1-ultra-bundle-d-61-75.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle D verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-core-application-flows-v1-ultra-bundle-d-61-75.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle D smoke test failed."
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

Write-Host "Core Application Flows Ultra Bundle D Mega Packs 61-75 completed successfully." -ForegroundColor Green
Write-Host "Restart API manually with: pnpm --filter api start:dev" -ForegroundColor Yellow
