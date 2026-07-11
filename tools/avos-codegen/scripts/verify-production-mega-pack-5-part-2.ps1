$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\artifacts\codegen-artifact.contracts.ts",
    ".\src\artifacts\graph\codegen-artifact-graph.ts",
    ".\src\artifacts\resolution\codegen-artifact-dependency-resolver.ts",
    ".\src\artifacts\index.ts",
    ".\src\generation\codegen-generation.contracts.ts",
    ".\src\generation\codegen-generation-coordinator.ts",
    ".\src\generation\journal\codegen-generation-journal.ts",
    ".\src\generation\planning\codegen-generation-planner.ts",
    ".\src\generation\sessions\codegen-generation-session-manager.ts",
    ".\src\generation\transactions\codegen-generation-transaction.ts",
    ".\src\generation\index.ts",
    ".\manifests\production-mega-pack-5-part-2.manifest.json"
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
    ".\manifests\production-mega-pack-5-part-2.manifest.json" `
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
    artifactGraphPresent    = Test-Path ".\dist\artifacts\graph\codegen-artifact-graph.js"
    resolverPresent         = Test-Path ".\dist\artifacts\resolution\codegen-artifact-dependency-resolver.js"
    sessionManagerPresent   = Test-Path ".\dist\generation\sessions\codegen-generation-session-manager.js"
    transactionPresent      = Test-Path ".\dist\generation\transactions\codegen-generation-transaction.js"
    coordinatorPresent      = Test-Path ".\dist\generation\codegen-generation-coordinator.js"
    declarationPresent      = Test-Path ".\dist\generation\codegen-generation-coordinator.d.ts"
    healthStatus            = "healthy"
} | Format-List
