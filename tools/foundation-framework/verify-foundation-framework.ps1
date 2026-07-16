[CmdletBinding()]
param(
    [string]$ProjectRoot = "C:\Users\User\Desktop\AVOS"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$root = Join-Path $ProjectRoot "apps\api\src\foundation-framework"
$required = @(
    "foundation-framework.types.ts",
    "foundation-framework.seed.ts",
    "foundation-framework.service.ts",
    "foundation-framework.controller.ts",
    "foundation-framework.module.ts",
    "index.ts"
)

$missing = @()
foreach ($file in $required) {
    if (-not (Test-Path (Join-Path $root $file))) {
        $missing += $file
    }
}

if ($missing.Count -gt 0) {
    throw "Missing foundation files: $($missing -join ', ')"
}

$service = Get-Content (Join-Path $root "foundation-framework.service.ts") -Raw
$seed = Get-Content (Join-Path $root "foundation-framework.seed.ts") -Raw
$controller = Get-Content (Join-Path $root "foundation-framework.controller.ts") -Raw
$appModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw

$checks = [ordered]@{
    capabilityRegistry = $seed.Contains('id: "capability-registry"')
    dependencyGraph = $seed.Contains('id: "enterprise-dependency-graph"')
    standardsEngine = $seed.Contains('id: "standards-engine"')
    architectureValidator = $seed.Contains('id: "architecture-validator"')
    contractRegistry = $seed.Contains('id: "enterprise-contract-registry"')
    metadataEngine = $seed.Contains('id: "platform-metadata-engine"')
    domainFramework = $seed.Contains('id: "domain-definition-framework"')
    policyRegistry = $seed.Contains('id: "enterprise-policy-registry"')
    schemaRegistry = $seed.Contains('id: "enterprise-schema-registry"')
    complianceEngine = $seed.Contains('id: "foundation-compliance-engine"')
    knowledgeRegistry = $seed.Contains('id: "enterprise-knowledge-registry"')
    blueprintRegistry = $seed.Contains('id: "enterprise-blueprint-registry"')
    healthRules = $seed.Contains('id: "platform-health-rules"')
    lifecycleManager = $seed.Contains('id: "enterprise-lifecycle-manager"')
    governanceLayer = $seed.Contains('id: "foundation-governance-layer"')
    circularDependencyDetection = $service.Contains("detectCircularDependencies")
    statusEndpoint = $controller.Contains('@Get("status")')
    validationEndpoint = $controller.Contains('@Post("validate")')
    appModuleRegistration = $appModule.Contains("FoundationFrameworkModule")
}

$failed = @($checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($failed.Count -gt 0) {
    throw "Foundation verification failed: $($failed.Name -join ', ')"
}

$result = [ordered]@{
    success = $true
    system = "AVOS Foundation Framework"
    version = "1.0.0"
    classification = "foundation-layer-zero"
    requiredFiles = $required.Count
    compiledChecks = $checks.Count
    capabilities = 15
    architectureValidation = "enabled"
    complianceGate = "enabled"
    status = "VERIFIED"
}

$result | ConvertTo-Json -Depth 10
