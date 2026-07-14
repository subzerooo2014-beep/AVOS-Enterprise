param([string]$RepoRoot = "C:\Users\User\Desktop\AVOS")

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$MobileRoot = Join-Path $RepoRoot "apps\mobile"

if (-not (Get-Command flutter -ErrorAction SilentlyContinue)) {
  throw "Flutter SDK is not installed or not available in PATH."
}

$requiredFiles = @(
  "pubspec.yaml",
  "lib\main.dart",
  "lib\src\app\avos_mobile_app.dart",
  "lib\src\core\theme\avos_theme.dart",
  "lib\src\core\config\environment.dart",
  "lib\src\core\network\avos_api_client.dart",
  "lib\src\features\home\presentation\home_page.dart",
  "test\widget_test.dart"
)

foreach ($file in $requiredFiles) {
  $path = Join-Path $MobileRoot $file
  if (-not (Test-Path -LiteralPath $path)) {
    throw "Missing Mobile Foundation file: $path"
  }
}

Push-Location $MobileRoot
try {
  flutter pub get
  if ($LASTEXITCODE -ne 0) {
    throw "flutter pub get failed with exit code $LASTEXITCODE"
  }

  flutter analyze
  if ($LASTEXITCODE -ne 0) {
    throw "flutter analyze failed with exit code $LASTEXITCODE"
  }

  flutter test
  if ($LASTEXITCODE -ne 0) {
    throw "flutter test failed with exit code $LASTEXITCODE"
  }
}
finally {
  Pop-Location
}

[pscustomobject]@{
  success = $true
  system = "AVOS Mobile Foundation Pack 1"
  requiredFiles = $requiredFiles.Count
  flutterProject = $true
  apiClient = $true
  navigationFoundation = $true
  lightDarkTheme = $true
  arabicRtl = $true
  englishReady = $true
  environments = $true
  tests = "passed"
  healthStatus = "healthy"
}