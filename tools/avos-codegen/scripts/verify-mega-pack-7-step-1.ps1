$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\planning\contracts\codegen-planning.contracts.ts",
    ".\src\planning\contracts\codegen-planner.contracts.ts",
    ".\src\planning\registry\codegen-planning-registry.ts",
    ".\src\planning\validation\codegen-planning-validator.ts",
    ".\src\planning\builders\codegen-execution-plan-builder.ts",
    ".\src\planning\engine\codegen-default-planner.ts",
    ".\src\planning\engine\codegen-planning-engine.ts",
    ".\src\planning\serialization\codegen-execution-plan-serializer.ts",
    ".\src\planning\index.ts",
    ".\manifests\mega-pack-7-step-1.manifest.json"
)

$MissingFiles = @(
    $RequiredFiles |
        Where-Object {
            -not (Test-Path $_)
        }
)

if ($MissingFiles.Count -gt 0) {
    throw "Missing files: $($MissingFiles -join ', ')"
}

$Manifest = Get-Content `
    ".\manifests\mega-pack-7-step-1.manifest.json" `
    -Raw |
ConvertFrom-Json

[PSCustomObject]@{
    success                  = $true
    system                   = $Manifest.system
    version                  = $Manifest.version
    pack                     = $Manifest.pack
    classification           = $Manifest.classification
    capabilities             = $Manifest.capabilities.Count
    requiredFiles            = $RequiredFiles.Count
    planningContractsPresent = Test-Path ".\dist\planning\contracts\codegen-planning.contracts.js"
    registryPresent          = Test-Path ".\dist\planning\registry\codegen-planning-registry.js"
    validatorPresent         = Test-Path ".\dist\planning\validation\codegen-planning-validator.js"
    builderPresent           = Test-Path ".\dist\planning\builders\codegen-execution-plan-builder.js"
    plannerPresent           = Test-Path ".\dist\planning\engine\codegen-default-planner.js"
    enginePresent            = Test-Path ".\dist\planning\engine\codegen-planning-engine.js"
    serializerPresent        = Test-Path ".\dist\planning\serialization\codegen-execution-plan-serializer.js"
    declarationPresent       = Test-Path ".\dist\planning\engine\codegen-planning-engine.d.ts"
    healthStatus             = "healthy"
} | Format-List
