$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\generators\v3\contracts\codegen-generator-v3-extended.contracts.ts",
    ".\src\generators\v3\pagination\codegen-generator-v3-pagination-renderer.ts",
    ".\src\generators\v3\repository\codegen-generator-v3-repository-renderer.ts",
    ".\src\generators\v3\repository\codegen-generator-v3-prisma-adapter-renderer.ts",
    ".\src\generators\v3\openapi\codegen-generator-v3-openapi-renderer.ts",
    ".\src\generators\v3\integration\codegen-generator-v3-integration-test-renderer.ts",
    ".\src\generators\v3\pipeline\codegen-generator-v3-pipeline-validator.ts",
    ".\src\generators\v3\quality\codegen-generator-v3-quality-gate.ts",
    ".\src\generators\v3\pipeline\codegen-generator-v3-pipeline.ts",
    ".\scripts\run-mega-pack-9-generator-v3-pipeline-smoke.ps1",
    ".\manifests\mega-pack-9-bundle-9-to-16.manifest.json"
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
    ".\manifests\mega-pack-9-bundle-9-to-16.manifest.json" `
    -Raw |
ConvertFrom-Json

[PSCustomObject]@{
    success                 = $true
    system                  = $Manifest.system
    version                 = $Manifest.version
    pack                    = $Manifest.pack
    classification          = $Manifest.classification
    capabilities            = $Manifest.capabilities.Count
    requiredFiles           = $RequiredFiles.Count
    extendedContracts       = Test-Path ".\dist\generators\v3\contracts\codegen-generator-v3-extended.contracts.js"
    paginationPresent       = Test-Path ".\dist\generators\v3\pagination\codegen-generator-v3-pagination-renderer.js"
    repositoryPresent       = Test-Path ".\dist\generators\v3\repository\codegen-generator-v3-repository-renderer.js"
    prismaAdapterPresent    = Test-Path ".\dist\generators\v3\repository\codegen-generator-v3-prisma-adapter-renderer.js"
    openApiPresent          = Test-Path ".\dist\generators\v3\openapi\codegen-generator-v3-openapi-renderer.js"
    integrationTestPresent  = Test-Path ".\dist\generators\v3\integration\codegen-generator-v3-integration-test-renderer.js"
    validatorPresent        = Test-Path ".\dist\generators\v3\pipeline\codegen-generator-v3-pipeline-validator.js"
    qualityGatePresent      = Test-Path ".\dist\generators\v3\quality\codegen-generator-v3-quality-gate.js"
    pipelinePresent         = Test-Path ".\dist\generators\v3\pipeline\codegen-generator-v3-pipeline.js"
    declarationPresent      = Test-Path ".\dist\generators\v3\pipeline\codegen-generator-v3-pipeline.d.ts"
    healthStatus            = "healthy"
} | Format-List
