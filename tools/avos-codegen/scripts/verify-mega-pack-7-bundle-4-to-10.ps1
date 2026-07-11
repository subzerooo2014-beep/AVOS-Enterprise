$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\incremental\contracts\codegen-incremental.contracts.ts",
    ".\src\incremental\detection\codegen-artifact-state-factory.ts",
    ".\src\incremental\detection\codegen-incremental-change-detector.ts",
    ".\src\incremental\regeneration\codegen-regeneration-policy-engine.ts",
    ".\src\incremental\planning\codegen-incremental-plan-builder.ts",
    ".\src\incremental\persistence\codegen-incremental-snapshot-store.ts",
    ".\src\incremental\persistence\codegen-incremental-snapshot-factory.ts",
    ".\src\incremental\persistence\codegen-incremental-serializer.ts",
    ".\src\incremental\recovery\codegen-incremental-recovery-engine.ts",
    ".\src\incremental\metrics\codegen-incremental-metrics-engine.ts",
    ".\src\incremental\runtime\codegen-incremental-runtime.ts",
    ".\src\incremental\index.ts",
    ".\scripts\run-mega-pack-7-incremental-smoke.ps1",
    ".\manifests\mega-pack-7-bundle-4-to-10.manifest.json"
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
    ".\manifests\mega-pack-7-bundle-4-to-10.manifest.json" `
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
    contractsPresent        = Test-Path ".\dist\incremental\contracts\codegen-incremental.contracts.js"
    changeDetectorPresent   = Test-Path ".\dist\incremental\detection\codegen-incremental-change-detector.js"
    policyEnginePresent     = Test-Path ".\dist\incremental\regeneration\codegen-regeneration-policy-engine.js"
    planBuilderPresent      = Test-Path ".\dist\incremental\planning\codegen-incremental-plan-builder.js"
    snapshotStorePresent    = Test-Path ".\dist\incremental\persistence\codegen-incremental-snapshot-store.js"
    recoveryPresent         = Test-Path ".\dist\incremental\recovery\codegen-incremental-recovery-engine.js"
    metricsPresent          = Test-Path ".\dist\incremental\metrics\codegen-incremental-metrics-engine.js"
    runtimePresent          = Test-Path ".\dist\incremental\runtime\codegen-incremental-runtime.js"
    declarationPresent      = Test-Path ".\dist\incremental\runtime\codegen-incremental-runtime.d.ts"
    healthStatus            = "healthy"
} | Format-List
