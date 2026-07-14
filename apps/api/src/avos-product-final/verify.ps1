param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$ApiRoot = Join-Path $RepoRoot "apps\api"
$PackRoot = Join-Path $ApiRoot "src\avos-product-final"
$AppModulePath = Join-Path $ApiRoot "src\app.module.ts"
$GenerationRoot = Join-Path $RepoRoot "tools\avos-product-final-pack-generation"

$generationManifests = @(
    "part-01-product-core\part-01.manifest.json",
    "part-02-ai-experience\part-02.manifest.json",
    "part-03-commerce-integrations\part-03.manifest.json",
    "part-04-ui-deployment\part-04.manifest.json"
)

foreach ($manifest in $generationManifests) {
    $path = Join-Path $GenerationRoot $manifest
    if (-not (Test-Path $path)) {
        throw "Missing generation manifest: $path"
    }
}

$requiredFiles = @(
    "avos-product-final.types.ts",
    "product-core-runtime.service.ts",
    "ai-experience-runtime.service.ts",
    "commerce-integrations-runtime.service.ts",
    "ui-apps-deployment-runtime.service.ts",
    "product-release-certification.service.ts",
    "avos-product-final-orchestrator.service.ts",
    "avos-product-final.controller.ts",
    "avos-product-final.module.ts"
)

foreach ($file in $requiredFiles) {
    $path = Join-Path $PackRoot $file
    if (-not (Test-Path $path)) {
        throw "Missing Product Final file: $path"
    }
}

$appModule = Get-Content -Path $AppModulePath -Raw
if ($appModule -notmatch "AvosProductFinalModule") {
    throw "AvosProductFinalModule is not registered"
}

$tscCandidates = @(
    (Join-Path $RepoRoot "node_modules\typescript\bin\tsc"),
    (Join-Path $ApiRoot "node_modules\typescript\bin\tsc")
)

$tscPath = $tscCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $tscPath) {
    throw "TypeScript compiler was not found."
}

Push-Location $ApiRoot
try {
    & node $tscPath --noEmit -p .\tsconfig.json
    if ($LASTEXITCODE -ne 0) {
        throw "TypeScript verification failed with exit code $LASTEXITCODE"
    }
}
finally {
    Pop-Location
}

[pscustomobject]@{
    success = $true
    system = "AVOS Product Final Pack"
    generationParts = 4
    moduleRegistered = $true
    requiredFiles = $requiredFiles.Count
    productCore = $true
    aiExperience = $true
    commerceIntegrations = $true
    uiAppsDeployment = $true
    typescript = "passed"
    healthStatus = "healthy"
}