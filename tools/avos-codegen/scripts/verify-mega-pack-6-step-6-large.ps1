$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\generation\requests\codegen-unified-generation.contracts.ts",
    ".\src\generation\results\codegen-unified-generation-result-builder.ts",
    ".\src\generation\pipelines\codegen-template-artifact-pipeline.ts",
    ".\src\generation\codegen-unified-generation.service.ts",
    ".\src\adapters\generators\codegen-generator-adapter.contracts.ts",
    ".\src\adapters\generators\codegen-generator-adapter.ts",
    ".\src\adapters\index.ts",
    ".\src\generators\enterprise-v2\enterprise-module-v2.contracts.ts",
    ".\src\generators\enterprise-v2\enterprise-module-v2.generator.ts",
    ".\src\generators\enterprise-v2\index.ts",
    ".\manifests\mega-pack-6-step-6-large.manifest.json"
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
    ".\manifests\mega-pack-6-step-6-large.manifest.json" `
    -Raw |
ConvertFrom-Json

[PSCustomObject]@{
    success                    = $true
    system                     = $Manifest.system
    version                    = $Manifest.version
    pack                       = $Manifest.pack
    classification             = $Manifest.classification
    capabilities               = $Manifest.capabilities.Count
    requiredFiles              = $RequiredFiles.Count
    unifiedContractsPresent    = Test-Path ".\dist\generation\requests\codegen-unified-generation.contracts.js"
    unifiedServicePresent      = Test-Path ".\dist\generation\codegen-unified-generation.service.js"
    generatorAdapterPresent    = Test-Path ".\dist\adapters\generators\codegen-generator-adapter.js"
    templatePipelinePresent    = Test-Path ".\dist\generation\pipelines\codegen-template-artifact-pipeline.js"
    enterpriseV2Present        = Test-Path ".\dist\generators\enterprise-v2\enterprise-module-v2.generator.js"
    resultBuilderPresent       = Test-Path ".\dist\generation\results\codegen-unified-generation-result-builder.js"
    declarationPresent         = Test-Path ".\dist\generation\codegen-unified-generation.service.d.ts"
    healthStatus               = "healthy"
} | Format-List
