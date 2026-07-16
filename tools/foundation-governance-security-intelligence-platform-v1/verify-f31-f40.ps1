[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"

$Root = Join-Path `
    $ProjectRoot `
    "apps\api\src\foundation-governance-security-intelligence-platform-v1"

$Required = @(
    "foundation-governance-security-intelligence-v1.types.ts",
    "foundation-integrations-v1.service.ts",
    "foundation-data-governance-v1.service.ts",
    "foundation-data-quality-v1.service.ts",
    "foundation-audit-integrity-v1.service.ts",
    "foundation-security-threat-v1.service.ts",
    "foundation-high-availability-v1.service.ts",
    "foundation-update-os-v1.service.ts",
    "foundation-evolution-engine-v1.service.ts",
    "foundation-enterprise-memory-v1.service.ts",
    "foundation-knowledge-graph-v1.service.ts",
    "foundation-digital-twin-v1.service.ts",
    "foundation-governance-security-intelligence-platform-v1.service.ts",
    "foundation-governance-security-intelligence-platform-v1.controller.ts",
    "foundation-governance-security-intelligence-platform-v1.module.ts",
    "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
    if (-not (Test-Path (Join-Path $Root $File))) {
        $Missing += $File
    }
}

if ($Missing.Count -gt 0) {
    throw "Missing F31-F40 files: $($Missing -join ', ')"
}

$AppModule = Get-Content `
    (Join-Path $ProjectRoot "apps\api\src\app.module.ts") `
    -Raw

$Module = Get-Content `
    (Join-Path $Root "foundation-governance-security-intelligence-platform-v1.module.ts") `
    -Raw

$Controller = Get-Content `
    (Join-Path $Root "foundation-governance-security-intelligence-platform-v1.controller.ts") `
    -Raw

$Service = Get-Content `
    (Join-Path $Root "foundation-governance-security-intelligence-platform-v1.service.ts") `
    -Raw

$ImportCount = (
    [regex]::Matches(
        $AppModule,
        'foundation-governance-security-intelligence-platform-v1/foundation-governance-security-intelligence-platform-v1\.module'
    )
).Count

$ModuleSymbolCount = (
    [regex]::Matches(
        $AppModule,
        '\bFoundationGovernanceSecurityIntelligencePlatformV1Module\b'
    )
).Count

$Checks = [ordered]@{
    moduleClass = $Module.Contains(
        "export class FoundationGovernanceSecurityIntelligencePlatformV1Module"
    )
    singleImportPath = $ImportCount -eq 1
    moduleRegistered = $AppModule -match `
        'imports:\s*\[\s*FoundationGovernanceSecurityIntelligencePlatformV1Module,'
    moduleSymbolOccurrences = $ModuleSymbolCount -eq 2
    statusEndpoint = $Controller.Contains('@Get("status")')
    diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
    integrationsEndpoint = $Controller.Contains('@Post("integrations")')
    governanceEndpoint = $Controller.Contains('@Post("governance")')
    qualityEndpoint = $Controller.Contains('@Post("quality-rules")')
    auditEndpoint = $Controller.Contains('@Post("audit")')
    securityEndpoint = $Controller.Contains('@Post("security/findings")')
    haEndpoint = $Controller.Contains('@Post("ha/heartbeat")')
    updatesEndpoint = $Controller.Contains('@Post("updates")')
    evolutionEndpoint = $Controller.Contains('@Post("evolution")')
    memoryEndpoint = $Controller.Contains('@Post("memory")')
    knowledgeEntityEndpoint = $Controller.Contains('@Post("knowledge/entities")')
    knowledgeRelationEndpoint = $Controller.Contains('@Post("knowledge/relations")')
    digitalTwinEndpoint = $Controller.Contains('@Post("digital-twins")')
    digitalTwinSyncEndpoint = $Controller.Contains('@Post("digital-twins/:id/synchronize")')
    metricsMethod = $Service.Contains("metrics(): FoundationFinalMetricsV1")
    statusMethod = $Service.Contains("status(): FoundationFinalStatusV1")
}

$Failed = @(
    $Checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($Failed.Count -gt 0) {
    throw "F31-F40 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
    success = $true
    system = "AVOS Foundation Governance, Security & Intelligence Platform V1"
    bundle = "F31-F40"
    requiredFiles = $Required.Count
    compiledChecks = $Checks.Count
    integrationsApiWebhooksSdk = "enabled"
    dataGovernance = "enabled"
    dataQuality = "enabled"
    auditComplianceIntegrity = "enabled"
    cybersecurityThreatDetection = "enabled"
    scalabilityHighAvailability = "enabled"
    updateOs = "enabled"
    evolutionEngine = "enabled"
    enterpriseMemoryCore = "enabled"
    knowledgeGraphFoundation = "enabled"
    digitalTwinFoundation = "enabled"
    duplicateModuleProtection = "enabled"
    foundationSeriesStatus = "FINAL_BUNDLE"
    status = "VERIFIED"
} | ConvertTo-Json -Depth 10
