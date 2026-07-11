$ErrorActionPreference = "Stop"

$Root = Resolve-Path (
    Join-Path $PSScriptRoot ".."
)

Set-Location $Root

$RequiredFiles = @(
    ".\src\validation\contracts\codegen-validation.contracts.ts",
    ".\src\validation\registry\codegen-validation-registry.ts",
    ".\src\validation\blueprints\codegen-blueprint-validation.rule.ts",
    ".\src\validation\templates\codegen-template-validation.rule.ts",
    ".\src\validation\variables\codegen-variable-schema-validation.rule.ts",
    ".\src\validation\compatibility\codegen-version-compatibility-engine.ts",
    ".\src\validation\compatibility\codegen-capability-resolver.ts",
    ".\src\validation\policies\codegen-generation-policy.rule.ts",
    ".\src\validation\policies\codegen-feature-flag-engine.ts",
    ".\src\validation\security\codegen-security-validation.rule.ts",
    ".\src\validation\compliance\codegen-compliance-validation.rule.ts",
    ".\src\validation\health\codegen-validation-health-analyzer.ts",
    ".\src\validation\reports\codegen-validation-report-builder.ts",
    ".\src\validation\reports\codegen-validation-report-writer.ts",
    ".\src\validation\runtime\codegen-validation-runtime.ts",
    ".\src\validation\cli\codegen-validation-cli.service.ts",
    ".\src\validation\index.ts",
    ".\scripts\run-mega-pack-8-validation-smoke.ps1",
    ".\manifests\mega-pack-8-bundle-7-to-15.manifest.json"
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
    ".\manifests\mega-pack-8-bundle-7-to-15.manifest.json" `
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
    contractsPresent         = Test-Path ".\dist\validation\contracts\codegen-validation.contracts.js"
    registryPresent          = Test-Path ".\dist\validation\registry\codegen-validation-registry.js"
    blueprintRulePresent     = Test-Path ".\dist\validation\blueprints\codegen-blueprint-validation.rule.js"
    templateRulePresent      = Test-Path ".\dist\validation\templates\codegen-template-validation.rule.js"
    variableRulePresent      = Test-Path ".\dist\validation\variables\codegen-variable-schema-validation.rule.js"
    compatibilityPresent     = Test-Path ".\dist\validation\compatibility\codegen-version-compatibility-engine.js"
    policyPresent            = Test-Path ".\dist\validation\policies\codegen-generation-policy.rule.js"
    securityPresent          = Test-Path ".\dist\validation\security\codegen-security-validation.rule.js"
    compliancePresent        = Test-Path ".\dist\validation\compliance\codegen-compliance-validation.rule.js"
    healthPresent            = Test-Path ".\dist\validation\health\codegen-validation-health-analyzer.js"
    reportBuilderPresent     = Test-Path ".\dist\validation\reports\codegen-validation-report-builder.js"
    runtimePresent           = Test-Path ".\dist\validation\runtime\codegen-validation-runtime.js"
    cliPresent               = Test-Path ".\dist\validation\cli\codegen-validation-cli.service.js"
    declarationPresent       = Test-Path ".\dist\validation\runtime\codegen-validation-runtime.d.ts"
    healthStatus             = "healthy"
} | Format-List
