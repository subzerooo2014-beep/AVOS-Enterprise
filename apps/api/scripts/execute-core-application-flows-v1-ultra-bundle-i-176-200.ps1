$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ExpectedBranch = "feature/services-platform-v2"
$CommitMessage = "feat(api): core application flows v1 ultra bundle i mega packs 176-200"
$ScriptRoot = $PSScriptRoot
$ApiRoot = Split-Path -Parent $ScriptRoot
$RepoRoot = (Resolve-Path (Join-Path $ApiRoot "..\..")).Path
$ModulePath = Join-Path $ApiRoot "src\workflows\workflows.module.ts"

Set-Location $RepoRoot

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne $ExpectedBranch) {
    throw "Expected branch '$ExpectedBranch' but found '$currentBranch'."
}

if (-not (Test-Path $ModulePath)) {
    throw "Workflows module not found: $ModulePath"
}

$requiredFiles = @(
    "apps/api/src/core-application-flows/core-flow-sovereignty.types.ts",
    "apps/api/src/core-application-flows/core-flow-sovereign-zone.service.ts",
    "apps/api/src/core-application-flows/core-flow-jurisdiction.service.ts",
    "apps/api/src/core-application-flows/core-flow-key-management.service.ts",
    "apps/api/src/core-application-flows/core-flow-continuity.service.ts",
    "apps/api/src/core-application-flows/core-flow-sovereignty.service.ts",
    "apps/api/src/core-application-flows/core-flow-sovereignty.controller.ts",
    "apps/api/scripts/verify-core-application-flows-v1-ultra-bundle-i-176-200.mjs",
    "apps/api/scripts/smoke-core-application-flows-v1-ultra-bundle-i-176-200.mjs",
    "apps/api/scripts/execute-core-application-flows-v1-ultra-bundle-i-176-200.ps1"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        throw "Missing required file: $file"
    }
}

$module = Get-Content -Raw -Encoding UTF8 $ModulePath

$imports = @(
'import { CoreFlowSovereigntyController } from "../core-application-flows/core-flow-sovereignty.controller";',
'import { CoreFlowSovereignZoneService } from "../core-application-flows/core-flow-sovereign-zone.service";',
'import { CoreFlowJurisdictionService } from "../core-application-flows/core-flow-jurisdiction.service";',
'import { CoreFlowKeyManagementService } from "../core-application-flows/core-flow-key-management.service";',
'import { CoreFlowContinuityService } from "../core-application-flows/core-flow-continuity.service";',
'import { CoreFlowSovereigntyService } from "../core-application-flows/core-flow-sovereignty.service";'
)

foreach ($import in $imports) {
    if (-not $module.Contains($import)) {
        $module = $module -replace '(?m)^@Module\(', ($import + "`r`n`r`n@Module(")
    }
}

function Add-ModuleArrayEntry {
    param(
        [string]$Text,
        [string]$ArrayName,
        [string]$Entry
    )

    if ($Text -match "(?s)$ArrayName\s*:\s*\[(.*?)\]" -and $Matches[1] -match "\b$([regex]::Escape($Entry))\b") {
        return $Text
    }

    $pattern = "(?s)($ArrayName\s*:\s*\[)"
    if ($Text -notmatch $pattern) {
        throw "Unable to locate '$ArrayName' array in workflows.module.ts"
    }

    return [regex]::Replace(
        $Text,
        $pattern,
        ('$1' + "`r`n    $Entry,"),
        1
    )
}

$module = Add-ModuleArrayEntry $module "controllers" "CoreFlowSovereigntyController"

$providers = @(
    "CoreFlowSovereignZoneService",
    "CoreFlowJurisdictionService",
    "CoreFlowKeyManagementService",
    "CoreFlowContinuityService",
    "CoreFlowSovereigntyService"
)

foreach ($entry in $providers) {
    $module = Add-ModuleArrayEntry $module "providers" $entry
    $module = Add-ModuleArrayEntry $module "exports" $entry
}

$module = $module.TrimEnd() + "`r`n"
Set-Content -Path $ModulePath -Value $module -Encoding UTF8 -NoNewline

Set-Location $ApiRoot

pnpm prisma generate
if ($LASTEXITCODE -ne 0) {
    throw "Prisma Client generation failed."
}

pnpm build
if ($LASTEXITCODE -ne 0) {
    throw "Core Application Flows Ultra Bundle I build failed."
}

$verificationJson = & node (Join-Path $ScriptRoot "verify-core-application-flows-v1-ultra-bundle-i-176-200.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle I verification failed."
}
$verificationJson | ConvertFrom-Json | Format-List

$smokeJson = & node (Join-Path $ScriptRoot "smoke-core-application-flows-v1-ultra-bundle-i-176-200.mjs")
if ($LASTEXITCODE -ne 0) {
    throw "Ultra Bundle I smoke test failed."
}
$smokeJson | ConvertFrom-Json | Format-List

Set-Location $RepoRoot

$filesToCommit = @($requiredFiles + "apps/api/src/workflows/workflows.module.ts")
git add -- $filesToCommit
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

Write-Host "Core Application Flows Ultra Bundle I Mega Packs 176-200 completed successfully." -ForegroundColor Green
Write-Host "Restart API manually with: pnpm --filter api start:dev" -ForegroundColor Yellow
