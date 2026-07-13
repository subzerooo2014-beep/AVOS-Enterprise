$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(api): finalize core application flows v1 mega packs 276-300"
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
    "apps/api/src/core-application-flows/core-flow-runtime.types.ts",
    "apps/api/src/core-application-flows/core-flow-runtime-registry.service.ts",
    "apps/api/src/core-application-flows/core-flow-runtime-coordinator.service.ts",
    "apps/api/src/core-application-flows/core-flow-runtime-finalization.service.ts",
    "apps/api/src/core-application-flows/core-flow-runtime-platform.service.ts",
    "apps/api/src/core-application-flows/core-flow-runtime.controller.ts",
    "apps/api/scripts/verify-core-application-flows-v1-ultra-bundle-m-276-300.mjs",
    "apps/api/scripts/smoke-core-application-flows-v1-ultra-bundle-m-276-300.mjs",
    "apps/api/scripts/execute-core-application-flows-v1-ultra-bundle-m-276-300.ps1"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) { throw "Missing required file: $file" }
}

$module = Get-Content -Raw -Encoding UTF8 $ModulePath
$imports = @(
'import { CoreFlowRuntimeController } from "../core-application-flows/core-flow-runtime.controller";',
'import { CoreFlowRuntimeRegistryService } from "../core-application-flows/core-flow-runtime-registry.service";',
'import { CoreFlowRuntimeCoordinatorService } from "../core-application-flows/core-flow-runtime-coordinator.service";',
'import { CoreFlowRuntimeFinalizationService } from "../core-application-flows/core-flow-runtime-finalization.service";',
'import { CoreFlowRuntimePlatformService } from "../core-application-flows/core-flow-runtime-platform.service";'
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
    if ($Text -notmatch $pattern) {
        throw "Unable to locate '$ArrayName' array."
    }
    return [regex]::Replace($Text, $pattern, ('$1' + "`r`n    $Entry,"), 1)
}

$module = Add-ModuleArrayEntry $module "controllers" "CoreFlowRuntimeController"
$providers = @(
    "CoreFlowRuntimeRegistryService",
    "CoreFlowRuntimeCoordinatorService",
    "CoreFlowRuntimeFinalizationService",
    "CoreFlowRuntimePlatformService"
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
if ($LASTEXITCODE -ne 0) { throw "Ultra Bundle M build failed." }

$verificationJson = & node (Join-Path $ScriptRoot "verify-core-application-flows-v1-ultra-bundle-m-276-300.mjs")
if ($LASTEXITCODE -ne 0) { throw "Ultra Bundle M verification failed." }
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-core-application-flows-v1-ultra-bundle-m-276-300.mjs")
if ($LASTEXITCODE -ne 0) { throw "Ultra Bundle M smoke failed." }
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

Write-Host "Core Application Flows V1 Ultra Bundle M completed successfully." -ForegroundColor Green
Write-Host "Core Application Flows V1 is complete through Mega Pack 300." -ForegroundColor Cyan
Write-Host "Restart API manually with: pnpm --filter api start:dev" -ForegroundColor Yellow
