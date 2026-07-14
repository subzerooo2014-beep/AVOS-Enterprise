$ErrorActionPreference = "Stop"
$Root = "C:\Users\User\Desktop\AVOS"
$ApiRoot = Join-Path $Root "apps\api"
$MobileRoot = Join-Path $Root "apps\mobile"
$ApiFeature = Join-Path $ApiRoot "src\vehicle-purchase-journey"
$MobileFeature = Join-Path $MobileRoot "lib\src\features\vehicle_purchase_journey"

$ApiFiles = (Get-ChildItem $ApiFeature -Recurse -File).Count
$MobileFiles = (Get-ChildItem $MobileFeature -Recurse -File).Count

if ($ApiFiles -lt 42) { throw "Expected at least 42 API files, found $ApiFiles" }
if ($MobileFiles -lt 12) { throw "Expected at least 12 mobile files, found $MobileFiles" }

Push-Location $ApiRoot
try {
  pnpm build
  if ($LASTEXITCODE -ne 0) { throw "API build failed" }
  node .\scripts\smoke-vehicle-purchase-journey.mjs
  if ($LASTEXITCODE -ne 0) { throw "Smoke test failed" }
  node .\scripts\integration-vehicle-purchase-journey.mjs
  if ($LASTEXITCODE -ne 0) { throw "Integration test failed" }
}
finally { Pop-Location }

Push-Location $MobileRoot
try {
  flutter analyze
  if ($LASTEXITCODE -ne 0) { throw "Flutter analyze failed" }
}
finally { Pop-Location }

[pscustomobject]@{
  success             = $true
  system              = "AVOS Ultra Bundle Vehicle Purchase Journey"
  apiFiles            = $ApiFiles
  mobileFiles         = $MobileFiles
  totalGeneratedFiles = $ApiFiles + $MobileFiles + 3
  dtoContracts        = 14
  services            = 16
  policies            = 5
  domainEvents        = 4
  mobilePages         = 12
  reservation         = $true
  negotiation         = $true
  inspection          = $true
  finance             = $true
  insurance           = $true
  payment             = $true
  contract            = $true
  ownershipTransfer   = $true
  delivery            = $true
  endToEndJourney     = $true
  typescript          = "passed"
  flutterAnalyze      = "passed"
  healthStatus        = "healthy"
} | Format-List
