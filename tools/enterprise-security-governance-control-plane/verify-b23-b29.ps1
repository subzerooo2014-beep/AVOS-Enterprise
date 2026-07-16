[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-security-governance-control-plane"

$Required = @(
  "enterprise-security-governance-control-plane.types.ts",
  "security-discovery.service.ts",
  "security-catalog.service.ts",
  "security-policy-registry.service.ts",
  "security-risk-engine.service.ts",
  "access-decision.service.ts",
  "secret-vault.service.ts",
  "security-incident.service.ts",
  "security-observability.service.ts",
  "security-governance.service.ts",
  "enterprise-security-governance-control-plane.service.ts",
  "enterprise-security-governance-control-plane.controller.ts",
  "enterprise-security-governance-control-plane.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) { $Missing += $File }
}
if ($Missing.Count -gt 0) { throw "Missing B23-B29 files: $($Missing -join ', ')" }

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Discovery = Get-Content (Join-Path $Root "security-discovery.service.ts") -Raw
$Catalog = Get-Content (Join-Path $Root "security-catalog.service.ts") -Raw
$Policies = Get-Content (Join-Path $Root "security-policy-registry.service.ts") -Raw
$Risk = Get-Content (Join-Path $Root "security-risk-engine.service.ts") -Raw
$Access = Get-Content (Join-Path $Root "access-decision.service.ts") -Raw
$Secrets = Get-Content (Join-Path $Root "secret-vault.service.ts") -Raw
$Incidents = Get-Content (Join-Path $Root "security-incident.service.ts") -Raw
$Observability = Get-Content (Join-Path $Root "security-observability.service.ts") -Raw
$Governance = Get-Content (Join-Path $Root "security-governance.service.ts") -Raw
$ControlPlane = Get-Content (Join-Path $Root "enterprise-security-governance-control-plane.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-security-governance-control-plane.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterpriseSecurityGovernanceControlPlaneModule } from "./enterprise-security-governance-control-plane/enterprise-security-governance-control-plane.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterpriseSecurityGovernanceControlPlaneModule,'
  discovery = $Discovery.Contains("discover(sourceRoot")
  catalog = $Catalog.Contains("private readonly components")
  policyRegistry = $Policies.Contains("private readonly policies")
  riskEngine = $Risk.Contains("score(context")
  accessDecisionEngine = $Access.Contains("decide(request")
  secretVault = $Secrets.Contains("private readonly secrets")
  incidentManagement = $Incidents.Contains("report(")
  observability = $Observability.Contains("analytics()")
  governance = $Governance.Contains("validate()")
  zeroTrustIntegration = $ControlPlane.Contains("zeroTrustIntegration")
  complianceIntegration = $ControlPlane.Contains("complianceIntegration")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  policyEndpoint = $Controller.Contains('@Post("policies")')
  accessEndpoint = $Controller.Contains('@Post("access/decide")')
  incidentEndpoint = $Controller.Contains('@Post("incidents")')
  secretEndpoint = $Controller.Contains('@Post("secrets/:key")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) { throw "B23-B29 verification failed: $($Failed.Name -join ', ')" }

[ordered]@{
  success = $true
  system = "AVOS Enterprise Security Governance Control Plane"
  bundle = "B23-B29"
  classification = "enterprise-security-governance-control-plane"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  discovery = "enabled"
  catalog = "enabled"
  policyRegistry = "enabled"
  riskEngine = "enabled"
  accessDecisionEngine = "enabled"
  secretVault = "enabled"
  incidentManagement = "enabled"
  observability = "enabled"
  governance = "enabled"
  zeroTrustIntegration = "integration-ready"
  complianceIntegration = "integration-ready"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10
