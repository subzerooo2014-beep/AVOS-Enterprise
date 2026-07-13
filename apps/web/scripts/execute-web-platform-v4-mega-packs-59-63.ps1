$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(web): web platform v4 mega packs 59-63 bundle"
$ScriptRoot = $PSScriptRoot
$WebRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $WebRoot "..\..")).Path

Set-Location $RepoRoot

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but found '$currentBranch'."
}

$requiredFiles = @(
    "apps/web/src/app/strategic-planner-command/page.tsx",
    "apps/web/src/app/resilience-laboratory/page.tsx",
    "apps/web/src/app/enterprise-coach-center/page.tsx",
    "apps/web/src/app/knowledge-academy-command/page.tsx",
    "apps/web/src/app/legacy-modernization-command/page.tsx",
    "apps/web/src/components/web-platform-v4-59-63/web-platform-v4-center.tsx",
    "apps/web/src/components/web-platform-v4-59-63/web-platform-v4-center.module.css",
    "apps/web/src/data/web-platform-v4-59-63.ts",
    "apps/web/scripts/verify-web-platform-v4-mega-packs-59-63.mjs",
    "apps/web/scripts/smoke-web-platform-v4-mega-packs-59-63.mjs",
    "apps/web/scripts/execute-web-platform-v4-mega-packs-59-63.ps1"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        throw "Missing required file: $file"
    }
}

Set-Location $WebRoot

$portProcessIds = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $portProcessIds) {
    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
}

Remove-Item .next -Recurse -Force -ErrorAction SilentlyContinue

pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Mega Packs 59-63 build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-web-platform-v4-mega-packs-59-63.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Packs 59-63 verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-web-platform-v4-mega-packs-59-63.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Mega Packs 59-63 smoke test failed."
}
$smokeJson | ConvertFrom-Json | Format-List

Set-Location $RepoRoot

git add -- $requiredFiles
if ($LASTEXITCODE -ne 0) {
    throw "git add failed."
}

git diff --cached --check
if ($LASTEXITCODE -ne 0) {
    throw "Git validation failed."
}

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) {
    throw "git commit failed."
}

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) {
    throw "git push failed."
}

Write-Host "Mega Packs 59-63 completed successfully." -ForegroundColor Green
Write-Host "Restart the development server manually with: pnpm --filter web dev" -ForegroundColor Yellow
