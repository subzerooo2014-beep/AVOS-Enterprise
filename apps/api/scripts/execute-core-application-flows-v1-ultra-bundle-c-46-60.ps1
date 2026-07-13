$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(api): core application flows v1 ultra bundle c mega packs 46-60"
$ScriptRoot = $PSScriptRoot
$ApiRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $ApiRoot "..\..")).Path

Set-Location $RepoRoot

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but found '$currentBranch'."
}

$requiredFiles = @(
    "apps/api/src/core-application-flows/core-flow-process-manager.types.ts",
    "apps/api/src/core-application-flows/core-flow-rules.service.ts",
    "apps/api/src/core-application-flows/core-flow-approval.service.ts",
    "apps/api/src/core-application-flows/core-flow-timeout.service.ts",
    "apps/api/src/core-application-flows/core-flow-process-manager.service.ts",
    "apps/api/src/core-application-flows/core-flow-process-manager.controller.ts",
    "apps/api/src/workflows/workflows.module.ts",
    "apps/api/scripts/verify-core-application-flows-v1-ultra-bundle-c-46-60.mjs",
    "apps/api/scripts/smoke-core-application-flows-v1-ultra-bundle-c-46-60.mjs",
    "apps/api/scripts/execute-core-application-flows-v1-ultra-bundle-c-46-60.ps1"
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
    throw "Core Application Flows Ultra Bundle C build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-core-application-flows-v1-ultra-bundle-c-46-60.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle C verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-core-application-flows-v1-ultra-bundle-c-46-60.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle C smoke test failed."
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

Write-Host "Core Application Flows Ultra Bundle C Mega Packs 46-60 completed successfully." -ForegroundColor Green
Write-Host "Restart API manually with: pnpm --filter api start:dev" -ForegroundColor Yellow
