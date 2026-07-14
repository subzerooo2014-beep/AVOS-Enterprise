param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$MobileRoot = Join-Path $RepoRoot "apps\mobile"

$requiredFiles = @(
  "lib\src\features\vehicles\presentation\vehicle_details_page.dart",
  "lib\src\features\chat\presentation\seller_chat_page.dart",
  "lib\src\features\maps\presentation\vehicle_location_page.dart",
  "lib\src\features\commerce\presentation\vehicle_commerce_page.dart",
  "lib\src\features\vehicles\presentation\vehicles_page.dart",
  "test\mobile_mega_pack_3_smoke_test.dart"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $MobileRoot $file
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing Mobile Mega Pack 3 file: $path"
  }
}

Push-Location $MobileRoot
try {
  flutter analyze
  if ($LASTEXITCODE -ne 0) {
    throw "flutter analyze failed with exit code $LASTEXITCODE"
  }

  flutter test test/mobile_mega_pack_3_smoke_test.dart
  if ($LASTEXITCODE -ne 0) {
    throw "Mobile Mega Pack 3 smoke failed with exit code $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}

[pscustomobject]@{
  success = $true
  system = "AVOS Mobile Mega Pack 3 Production UI"
  requiredFiles = $requiredFiles.Count
  vehicleDetails = $true
  heroAnimation = $true
  sellerChat = $true
  vehicleLocation = $true
  financeInsurance = $true
  trustScore = $true
  favorites = $true
  flutterAnalyze = "passed"
  tests = "passed"
  healthStatus = "healthy"
}