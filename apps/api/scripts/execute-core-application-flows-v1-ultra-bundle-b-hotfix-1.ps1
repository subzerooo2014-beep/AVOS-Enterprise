$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "fix(api): core flow rate limit exception compatibility"
$ScriptRoot = $PSScriptRoot
$ApiRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $ApiRoot "..\..")).Path

Set-Location $RepoRoot

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but found '$currentBranch'."
}

$requiredFiles = @(
    "apps/api/src/core-application-flows/core-flow-rate-limit.service.ts",
    "apps/api/scripts/verify-core-application-flows-v1-ultra-bundle-b-hotfix-1.mjs",
    "apps/api/scripts/smoke-core-application-flows-v1-ultra-bundle-b-hotfix-1.mjs",
    "apps/api/scripts/execute-core-application-flows-v1-ultra-bundle-b-hotfix-1.ps1"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        throw "Missing required file: $file"
    }
}

Set-Location $ApiRoot

pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle B Hotfix 1 build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-core-application-flows-v1-ultra-bundle-b-hotfix-1.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle B Hotfix 1 verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-core-application-flows-v1-ultra-bundle-b-hotfix-1.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle B Hotfix 1 smoke test failed."
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

Write-Host "Ultra Bundle B Hotfix 1 completed successfully." -ForegroundColor Green
Write-Host "Restart API manually with: pnpm --filter api start:dev" -ForegroundColor Yellow
