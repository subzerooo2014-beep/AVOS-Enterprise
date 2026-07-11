$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\generators\v3\contracts\codegen-generator-v3.contracts.ts",
    ".\src\generators\v3\naming\codegen-generator-v3-naming-engine.ts",
    ".\src\generators\v3\renderers\codegen-generator-v3-field-renderer.ts",
    ".\src\generators\v3\runtime\codegen-generator-v3-artifact-factory.ts",
    ".\src\generators\v3\module\codegen-generator-v3-module-renderer.ts",
    ".\src\generators\v3\module\codegen-generator-v3-dto-renderer.ts",
    ".\src\generators\v3\module\codegen-generator-v3-manifest-renderer.ts",
    ".\src\generators\v3\prisma\codegen-generator-v3-prisma-renderer.ts",
    ".\src\generators\v3\tests\codegen-generator-v3-test-renderer.ts",
    ".\src\generators\v3\runtime\codegen-generator-v3-runtime.ts",
    ".\src\generators\v3\index.ts",
    ".\scripts\run-mega-pack-9-generator-v3-smoke.ps1",
    ".\manifests\mega-pack-9-bundle-1-to-8.manifest.json"
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
    ".\manifests\mega-pack-9-bundle-1-to-8.manifest.json" `
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
    contractsPresent        = Test-Path ".\dist\generators\v3\contracts\codegen-generator-v3.contracts.js"
    namingPresent           = Test-Path ".\dist\generators\v3\naming\codegen-generator-v3-naming-engine.js"
    fieldRendererPresent    = Test-Path ".\dist\generators\v3\renderers\codegen-generator-v3-field-renderer.js"
    artifactFactoryPresent  = Test-Path ".\dist\generators\v3\runtime\codegen-generator-v3-artifact-factory.js"
    moduleRendererPresent   = Test-Path ".\dist\generators\v3\module\codegen-generator-v3-module-renderer.js"
    dtoRendererPresent      = Test-Path ".\dist\generators\v3\module\codegen-generator-v3-dto-renderer.js"
    prismaRendererPresent   = Test-Path ".\dist\generators\v3\prisma\codegen-generator-v3-prisma-renderer.js"
    testRendererPresent     = Test-Path ".\dist\generators\v3\tests\codegen-generator-v3-test-renderer.js"
    manifestPresent         = Test-Path ".\dist\generators\v3\module\codegen-generator-v3-manifest-renderer.js"
    runtimePresent          = Test-Path ".\dist\generators\v3\runtime\codegen-generator-v3-runtime.js"
    declarationPresent      = Test-Path ".\dist\generators\v3\runtime\codegen-generator-v3-runtime.d.ts"
    healthStatus            = "healthy"
} | Format-List
