$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(api): core application flows v2 ultra bundle n mega packs 301-325"
$ScriptRoot = $PSScriptRoot
$ApiRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $ApiRoot "..\..")).Path
$ModulePath = Join-Path $ApiRoot "src\workflows\workflows.module.ts"

Set-Location $RepoRoot

if ((git branch --show-current).Trim() -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch'."
}
if (-not (Test-Path $ModulePath)) {
    throw "Workflows module not found: $ModulePath"
}

$requiredFiles = @(
    "apps/api/src/core-application-flows-v2/core-flow-durable.types.ts",
    "apps/api/src/core-application-flows-v2/core-flow-durable-store.service.ts",
    "apps/api/src/core-application-flows-v2/core-flow-idempotency.service.ts",
    "apps/api/src/core-application-flows-v2/core-flow-durable-runtime.service.ts",
    "apps/api/src/core-application-flows-v2/core-flow-durable.controller.ts",
    "apps/api/scripts/verify-core-application-flows-v2-ultra-bundle-n-301-325.mjs",
    "apps/api/scripts/smoke-core-application-flows-v2-ultra-bundle-n-301-325.mjs",
    "apps/api/scripts/execute-core-application-flows-v2-ultra-bundle-n-301-325.ps1"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) { throw "Missing required file: $file" }
}

$module = Get-Content -Raw -Encoding UTF8 $ModulePath
$imports = @(
'import { CoreFlowDurableController } from "../core-application-flows-v2/core-flow-durable.controller";',
'import { CoreFlowDurableStoreService } from "../core-application-flows-v2/core-flow-durable-store.service";',
'import { CoreFlowIdempotencyService } from "../core-application-flows-v2/core-flow-idempotency.service";',
'import { CoreFlowDurableRuntimeService } from "../core-application-flows-v2/core-flow-durable-runtime.service";'
)

foreach ($import in $imports) {
    if (-not $module.Contains($import)) {
        $module = $module -replace '(?m)^@Module\(', ($import + "`r`n`r`n@Module(")
    }
}

function Add-ModuleArrayEntry {
    param([string]$Text, [string]$ArrayName, [string]$Entry)
    if ($Text -match "(?s)$ArrayName\s*:\s*\[(.*?)\]" -and
        $Matches[1] -match "\b$([regex]::Escape($Entry))\b") {
        return $Text
    }
    $pattern = "(?s)($ArrayName\s*:\s*\[)"
    if ($Text -notmatch $pattern) { throw "Unable to locate '$ArrayName' array." }
    return [regex]::Replace($Text, $pattern, ('$1' + "`r`n    $Entry,"), 1)
}

$module = Add-ModuleArrayEntry $module "controllers" "CoreFlowDurableController"
$providers = @(
    "CoreFlowDurableStoreService",
    "CoreFlowIdempotencyService",
    "CoreFlowDurableRuntimeService"
)
foreach ($entry in $providers) {
    $module = Add-ModuleArrayEntry $module "providers" $entry
    $module = Add-ModuleArrayEntry $module "exports" $entry
}

$module = $module.TrimEnd() + "`r`n"
Set-Content -Path $ModulePath -Value $module -Encoding UTF8 -NoNewline

Set-Location $ApiRoot

pnpm prisma generate
if ($LASTEXITCODE -ne 0) { throw "Prisma Client generation failed." }

pnpm build
if ($LASTEXITCODE -ne 0) { throw "Ultra Bundle N build failed." }

$verificationJson = & node (Join-Path $ScriptRoot "verify-core-application-flows-v2-ultra-bundle-n-301-325.mjs")
if ($LASTEXITCODE -ne 0) { throw "Ultra Bundle N verification failed." }
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-core-application-flows-v2-ultra-bundle-n-301-325.mjs")
if ($LASTEXITCODE -ne 0) { throw "Ultra Bundle N smoke failed." }
$smokeJson | ConvertFrom-Json | Format-List

Set-Location $RepoRoot
$filesToCommit = @($requiredFiles + "apps/api/src/workflows/workflows.module.ts")
git add -- $filesToCommit
if ($LASTEXITCODE -ne 0) { throw "git add failed." }

git diff --cached --check
if ($LASTEXITCODE -ne 0) { throw "Git staged validation failed." }

git commit -m $CommitMessage
if ($LASTEXITCODE -ne 0) { throw "git commit failed." }

git push origin $ExpectedBranch
if ($LASTEXITCODE -ne 0) { throw "git push failed." }

Write-Host "Core Application Flows V2 Ultra Bundle N completed successfully." -ForegroundColor Green
Write-Host "Restart API manually with: pnpm --filter api start:dev" -ForegroundColor Yellow
