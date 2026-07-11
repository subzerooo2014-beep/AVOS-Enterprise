$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\output\codegen-output.contracts.ts",
    ".\src\output\codegen-output-coordinator.ts",
    ".\src\output\atomic\codegen-atomic-file-writer.ts",
    ".\src\output\locking\codegen-workspace-lock-manager.ts",
    ".\src\output\conflicts\codegen-output-conflict-detector.ts",
    ".\src\output\fingerprints\codegen-file-fingerprint-engine.ts",
    ".\src\output\manifests\codegen-output-manifest-engine.ts",
    ".\src\output\reports\codegen-generation-report-engine.ts",
    ".\src\output\integrity\codegen-output-integrity-verifier.ts",
    ".\src\output\preview\codegen-output-preview-engine.ts",
    ".\src\output\recovery\codegen-output-recovery-engine.ts",
    ".\src\output\index.ts",
    ".\manifests\production-mega-pack-5-part-3.manifest.json"
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
    ".\manifests\production-mega-pack-5-part-3.manifest.json" `
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
    atomicWriterPresent      = Test-Path ".\dist\output\atomic\codegen-atomic-file-writer.js"
    lockManagerPresent       = Test-Path ".\dist\output\locking\codegen-workspace-lock-manager.js"
    conflictDetectorPresent  = Test-Path ".\dist\output\conflicts\codegen-output-conflict-detector.js"
    fingerprintPresent       = Test-Path ".\dist\output\fingerprints\codegen-file-fingerprint-engine.js"
    manifestEnginePresent    = Test-Path ".\dist\output\manifests\codegen-output-manifest-engine.js"
    reportEnginePresent      = Test-Path ".\dist\output\reports\codegen-generation-report-engine.js"
    integrityPresent         = Test-Path ".\dist\output\integrity\codegen-output-integrity-verifier.js"
    previewPresent           = Test-Path ".\dist\output\preview\codegen-output-preview-engine.js"
    recoveryPresent          = Test-Path ".\dist\output\recovery\codegen-output-recovery-engine.js"
    coordinatorPresent       = Test-Path ".\dist\output\codegen-output-coordinator.js"
    declarationPresent       = Test-Path ".\dist\output\codegen-output-coordinator.d.ts"
    healthStatus             = "healthy"
} | Format-List
