param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$MobileRoot = Join-Path $RepoRoot "apps\mobile"
$requiredFiles = @(
  "lib\src\features\home\presentation\home_page.dart",
  "lib\src\features\vehicles\domain\vehicle.dart",
  "lib\src\features\vehicles\data\vehicle_repository.dart",
  "lib\src\features\vehicles\presentation\vehicles_page.dart",
  "lib\src\features\favorites\presentation\favorites_page.dart",
  "lib\src\features\profile\presentation\profile_page.dart",
  "lib\src\features\azm\presentation\azm_assistant_page.dart",
  "test\mobile_mega_pack_2_test.dart"
)
foreach ($file in $requiredFiles) {
  $path = Join-Path $MobileRoot $file
  if (-not (Test-Path -LiteralPath $path)) { throw "Missing Mobile Mega Pack 2 file: $path" }
}
Push-Location $MobileRoot
try {
  flutter pub get
  if ($LASTEXITCODE -ne 0) { throw "flutter pub get failed with exit code $LASTEXITCODE" }
  flutter analyze
  if ($LASTEXITCODE -ne 0) { throw "flutter analyze failed with exit code $LASTEXITCODE" }
  flutter test test/mobile_mega_pack_2_test.dart
  if ($LASTEXITCODE -ne 0) { throw "Mobile Mega Pack 2 test failed with exit code $LASTEXITCODE" }
}
finally { Pop-Location }
[pscustomobject]@{
  success = $true
  system = "AVOS Mobile Mega Pack 2"
  requiredFiles = $requiredFiles.Count
  professionalHome = $true
  azmAssistant = $true
  vehicleMarketplace = $true
  searchAndFilters = $true
  favorites = $true
  profile = $true
  navigation = $true
  flutterAnalyze = "passed"
  tests = "passed"
  healthStatus = "healthy"
}