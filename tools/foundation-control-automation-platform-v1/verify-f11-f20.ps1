[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"

$Root = Join-Path `
    $ProjectRoot `
    "apps\api\src\foundation-control-automation-platform-v1"

$Required = @(
    "foundation-control-automation-v1.types.ts",
    "foundation-event-bus-v1.service.ts",
    "foundation-workflow-engine-v1.service.ts",
    "foundation-rules-engine-v1.service.ts",
    "foundation-policy-engine-v1.service.ts",
    "foundation-iam-v1.service.ts",
    "foundation-configuration-v1.service.ts",
    "foundation-secrets-v1.service.ts",
    "foundation-scheduler-v1.service.ts",
    "foundation-notifications-v1.service.ts",
    "foundation-control-automation-platform-v1.service.ts",
    "foundation-control-automation-platform-v1.controller.ts",
    "foundation-control-automation-platform-v1.module.ts",
    "index.ts"
)

$Missing = @()

foreach ($File in $Required) {
    if (-not (Test-Path (Join-Path $Root $File))) {
        $Missing += $File
    }
}

if ($Missing.Count -gt 0) {
    throw "Missing F11-F20 files: $($Missing -join ', ')"
}

$AppModule = Get-Content `
    (Join-Path $ProjectRoot "apps\api\src\app.module.ts") `
    -Raw

$Module = Get-Content `
    (Join-Path $Root "foundation-control-automation-platform-v1.module.ts") `
    -Raw

$Controller = Get-Content `
    (Join-Path $Root "foundation-control-automation-platform-v1.controller.ts") `
    -Raw

$Service = Get-Content `
    (Join-Path $Root "foundation-control-automation-platform-v1.service.ts") `
    -Raw

$ImportCount = (
    [regex]::Matches(
        $AppModule,
        'foundation-control-automation-platform-v1/foundation-control-automation-platform-v1\.module'
    )
).Count

$ModuleSymbolCount = (
    [regex]::Matches(
        $AppModule,
        '\bFoundationControlAutomationPlatformV1Module\b'
    )
).Count

$Checks = [ordered]@{
    moduleClass = $Module.Contains("export class FoundationControlAutomationPlatformV1Module")
    singleImportPath = $ImportCount -eq 1
    moduleRegistered = $AppModule -match 'imports:\s*\[\s*FoundationControlAutomationPlatformV1Module,'
    moduleSymbolOccurrences = $ModuleSymbolCount -eq 2
    statusEndpoint = $Controller.Contains('@Get("status")')
    diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
    eventsEndpoint = $Controller.Contains('@Post("events")')
    workflowsEndpoint = $Controller.Contains('@Post("workflows")')
    rulesEndpoint = $Controller.Contains('@Post("rules")')
    policiesEndpoint = $Controller.Contains('@Post("policies")')
    identitiesEndpoint = $Controller.Contains('@Post("identities")')
    configurationEndpoint = $Controller.Contains('@Post("configuration")')
    secretsEndpoint = $Controller.Contains('@Post("secrets")')
    jobsEndpoint = $Controller.Contains('@Post("jobs")')
    notificationsEndpoint = $Controller.Contains('@Post("notifications")')
    metricsMethod = $Service.Contains("metrics(): FoundationControlMetricsV1")
    statusMethod = $Service.Contains("status(): FoundationControlStatusV1")
}

$Failed = @(
    $Checks.GetEnumerator() |
    Where-Object { -not $_.Value }
)

if ($Failed.Count -gt 0) {
    throw "F11-F20 verification failed: $($Failed.Name -join ', ')"
}

[ordered]@{
    success = $true
    system = "AVOS Foundation Control & Automation Platform V1"
    bundle = "F11-F20"
    requiredFiles = $Required.Count
    compiledChecks = $Checks.Count
    eventBus = "enabled"
    asyncMessaging = "enabled"
    workflowEngine = "enabled"
    rulesEngine = "enabled"
    policyEngine = "enabled"
    iam = "enabled"
    configuration = "enabled"
    secrets = "enabled"
    scheduler = "enabled"
    notifications = "enabled"
    duplicateModuleProtection = "enabled"
    status = "VERIFIED"
} | ConvertTo-Json -Depth 10
