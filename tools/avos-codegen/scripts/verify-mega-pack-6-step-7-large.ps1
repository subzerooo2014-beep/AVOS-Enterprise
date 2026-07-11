$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\blueprints\enterprise-module-v2\enterprise-module-v2.blueprint.json",
    ".\src\blueprints\bootstrap\codegen-blueprint-bootstrap.contracts.ts",
    ".\src\blueprints\bootstrap\codegen-blueprint-bootstrap.service.ts",
    ".\src\generation\bootstrap\codegen-generation-bootstrap.ts",
    ".\src\runtime\smoke\codegen-smoke.contracts.ts",
    ".\src\runtime\smoke\codegen-end-to-end-smoke-runner.ts",
    ".\src\runtime\smoke\codegen-smoke-cli.ts",
    ".\src\runtime\smoke\index.ts",
    ".\scripts\run-mega-pack-6-smoke.ps1",
    ".\manifests\mega-pack-6-step-7-large.manifest.json"
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
    ".\manifests\mega-pack-6-step-7-large.manifest.json" `
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
    blueprintPresent        = Test-Path ".\blueprints\enterprise-module-v2\enterprise-module-v2.blueprint.json"
    bootstrapPresent        = Test-Path ".\dist\blueprints\bootstrap\codegen-blueprint-bootstrap.service.js"
    runtimeFactoryPresent   = Test-Path ".\dist\generation\bootstrap\codegen-generation-bootstrap.js"
    smokeRunnerPresent      = Test-Path ".\dist\runtime\smoke\codegen-end-to-end-smoke-runner.js"
    smokeCliPresent         = Test-Path ".\dist\runtime\smoke\codegen-smoke-cli.js"
    declarationPresent      = Test-Path ".\dist\runtime\smoke\codegen-end-to-end-smoke-runner.d.ts"
    healthStatus            = "healthy"
} | Format-List
