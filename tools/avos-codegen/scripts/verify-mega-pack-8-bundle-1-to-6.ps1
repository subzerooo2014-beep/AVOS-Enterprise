$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\quality\contracts\codegen-quality.contracts.ts",
    ".\src\quality\validation\codegen-quality-rule-registry.ts",
    ".\src\quality\naming\codegen-naming.utilities.ts",
    ".\src\quality\naming\codegen-file-naming.rule.ts",
    ".\src\quality\imports\codegen-import-analyzer.ts",
    ".\src\quality\imports\codegen-duplicate-import.rule.ts",
    ".\src\quality\validation\codegen-nestjs-structure.rule.ts",
    ".\src\quality\validation\codegen-dto-validation.rule.ts",
    ".\src\quality\validation\codegen-test-presence.rule.ts",
    ".\src\quality\analysis\codegen-source-complexity-analyzer.ts",
    ".\src\quality\analysis\codegen-complexity.rule.ts",
    ".\src\quality\reports\codegen-quality-report-builder.ts",
    ".\src\quality\reports\codegen-quality-report-writer.ts",
    ".\src\quality\runtime\codegen-quality-runtime.ts",
    ".\src\quality\index.ts",
    ".\scripts\run-mega-pack-8-quality-smoke.ps1",
    ".\manifests\mega-pack-8-bundle-1-to-6.manifest.json"
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
    ".\manifests\mega-pack-8-bundle-1-to-6.manifest.json" `
    -Raw |
ConvertFrom-Json

[PSCustomObject]@{
    success                = $true
    system                 = $Manifest.system
    version                = $Manifest.version
    pack                   = $Manifest.pack
    classification         = $Manifest.classification
    capabilities           = $Manifest.capabilities.Count
    requiredFiles          = $RequiredFiles.Count
    contractsPresent       = Test-Path ".\dist\quality\contracts\codegen-quality.contracts.js"
    registryPresent        = Test-Path ".\dist\quality\validation\codegen-quality-rule-registry.js"
    namingRulePresent      = Test-Path ".\dist\quality\naming\codegen-file-naming.rule.js"
    importAnalyzerPresent  = Test-Path ".\dist\quality\imports\codegen-import-analyzer.js"
    nestRulePresent        = Test-Path ".\dist\quality\validation\codegen-nestjs-structure.rule.js"
    dtoRulePresent         = Test-Path ".\dist\quality\validation\codegen-dto-validation.rule.js"
    testRulePresent        = Test-Path ".\dist\quality\validation\codegen-test-presence.rule.js"
    complexityPresent      = Test-Path ".\dist\quality\analysis\codegen-complexity.rule.js"
    reportBuilderPresent   = Test-Path ".\dist\quality\reports\codegen-quality-report-builder.js"
    runtimePresent         = Test-Path ".\dist\quality\runtime\codegen-quality-runtime.js"
    declarationPresent     = Test-Path ".\dist\quality\runtime\codegen-quality-runtime.d.ts"
    healthStatus           = "healthy"
} | Format-List
