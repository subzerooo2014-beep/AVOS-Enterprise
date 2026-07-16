[CmdletBinding()]
param([string]$ProjectRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
$Root = Join-Path $ProjectRoot "apps\api\src\enterprise-zero-trust-security-platform"

$Required = @(
  "zero-trust-security.types.ts",
  "identity-registry.service.ts",
  "authorization-center.service.ts",
  "secret-vault.service.ts",
  "key-management.service.ts",
  "encryption-engine.service.ts",
  "certificate-manager.service.ts",
  "audit-center.service.ts",
  "threat-detection.service.ts",
  "security-analytics.service.ts",
  "enterprise-zero-trust-security.service.ts",
  "enterprise-zero-trust-security.controller.ts",
  "enterprise-zero-trust-security.module.ts",
  "index.ts"
)

$Missing = @()
foreach ($File in $Required) {
  if (-not (Test-Path (Join-Path $Root $File))) { $Missing += $File }
}
if ($Missing.Count -gt 0) { throw "Missing X1.3 files: $($Missing -join ', ')" }

$AppModule = Get-Content (Join-Path $ProjectRoot "apps\api\src\app.module.ts") -Raw
$Identity = Get-Content (Join-Path $Root "identity-registry.service.ts") -Raw
$Authorization = Get-Content (Join-Path $Root "authorization-center.service.ts") -Raw
$Secrets = Get-Content (Join-Path $Root "secret-vault.service.ts") -Raw
$Keys = Get-Content (Join-Path $Root "key-management.service.ts") -Raw
$Encryption = Get-Content (Join-Path $Root "encryption-engine.service.ts") -Raw
$Certificates = Get-Content (Join-Path $Root "certificate-manager.service.ts") -Raw
$Audit = Get-Content (Join-Path $Root "audit-center.service.ts") -Raw
$Threats = Get-Content (Join-Path $Root "threat-detection.service.ts") -Raw
$Analytics = Get-Content (Join-Path $Root "security-analytics.service.ts") -Raw
$Platform = Get-Content (Join-Path $Root "enterprise-zero-trust-security.service.ts") -Raw
$Controller = Get-Content (Join-Path $Root "enterprise-zero-trust-security.controller.ts") -Raw

$Checks = [ordered]@{
  appModuleImport = $AppModule.Contains('import { EnterpriseZeroTrustSecurityPlatformModule } from "./enterprise-zero-trust-security-platform/enterprise-zero-trust-security.module";')
  appModuleRegistration = $AppModule -match 'imports:\s*\[\s*EnterpriseZeroTrustSecurityPlatformModule,'
  identityRegistry = $Identity.Contains("private readonly identities")
  authorizationCenter = $Authorization.Contains("decide(")
  secretVault = $Secrets.Contains("private readonly secrets")
  keyManagement = $Keys.Contains("generate(")
  encryptionEngine = $Encryption.Contains("encrypt(") -and $Encryption.Contains("decrypt(")
  certificateManager = $Certificates.Contains("validate(")
  auditCenter = $Audit.Contains("record(")
  threatDetection = $Threats.Contains("detect(")
  securityAnalytics = $Analytics.Contains("snapshot()")
  zeroTrustDecisioning = $Platform.Contains("zeroTrustDecisioning")
  statusEndpoint = $Controller.Contains('@Get("status")')
  diagnosticsEndpoint = $Controller.Contains('@Get("diagnostics")')
  identityEndpoint = $Controller.Contains('@Post("identities")')
  policyEndpoint = $Controller.Contains('@Post("policies")')
  authorizeEndpoint = $Controller.Contains('@Post("authorize")')
  secretEndpoint = $Controller.Contains('@Post("secrets/:key")')
  keyEndpoint = $Controller.Contains('@Post("keys/:id")')
  encryptEndpoint = $Controller.Contains('@Post("encrypt")')
  certificateEndpoint = $Controller.Contains('@Post("certificates")')
  threatEndpoint = $Controller.Contains('@Post("threats")')
}

$Failed = @($Checks.GetEnumerator() | Where-Object { -not $_.Value })
if ($Failed.Count -gt 0) { throw "X1.3 verification failed: $($Failed.Name -join ', ')" }

[ordered]@{
  success = $true
  system = "AVOS Enterprise Zero Trust Security Platform"
  bundle = "X1.3"
  classification = "zero-trust-security-platform"
  requiredFiles = $Required.Count
  compiledChecks = $Checks.Count
  identityRegistry = "enabled"
  authorizationCenter = "enabled"
  secretVault = "enabled"
  keyManagement = "enabled"
  encryptionEngine = "enabled"
  certificateManager = "enabled"
  auditCenter = "enabled"
  threatDetection = "enabled"
  securityAnalytics = "enabled"
  zeroTrustDecisioning = "enabled"
  status = "VERIFIED"
} | ConvertTo-Json -Depth 10

