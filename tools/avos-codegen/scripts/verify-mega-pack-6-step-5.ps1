$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\blueprints\runtime\codegen-blueprint-variable-merge-engine.ts",
    ".\src\blueprints\runtime\codegen-blueprint-binding-resolver.ts",
    ".\src\blueprints\runtime\codegen-template-artifact-mapper.ts",
    ".\src\blueprints\runtime\codegen-blueprint-runtime-result-builder.ts",
    ".\src\blueprints\runtime\codegen-blueprint-runtime-executor.ts",
    ".\src\blueprints\runtime\codegen-blueprint-execution-orchestrator.ts",
    ".\src\blueprints\runtime\index.ts",
    ".\src\blueprints\index.ts",
    ".\manifests\mega-pack-6-step-5.manifest.json"
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
    ".\manifests\mega-pack-6-step-5.manifest.json" `
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
    variableMergePresent       = Test-Path ".\dist\blueprints\runtime\codegen-blueprint-variable-merge-engine.js"
    bindingResolverPresent     = Test-Path ".\dist\blueprints\runtime\codegen-blueprint-binding-resolver.js"
    artifactMapperPresent      = Test-Path ".\dist\blueprints\runtime\codegen-template-artifact-mapper.js"
    runtimeExecutorPresent     = Test-Path ".\dist\blueprints\runtime\codegen-blueprint-runtime-executor.js"
    orchestratorPresent        = Test-Path ".\dist\blueprints\runtime\codegen-blueprint-execution-orchestrator.js"
    declarationPresent         = Test-Path ".\dist\blueprints\runtime\codegen-blueprint-execution-orchestrator.d.ts"
    healthStatus               = "healthy"
} | Format-List
