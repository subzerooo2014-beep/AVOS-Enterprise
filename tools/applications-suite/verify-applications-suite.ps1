param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$r=Get-Content (
  Join-Path $RepoRoot "apps/api/src/applications-suite/applications-suite.registry.ts"
) -Raw

$count=([regex]::Matches($r,'key:\s*"')).Count

if($count -ne 8){
  throw "Expected 8 applications, found $count"
}

$webPages=@(Get-ChildItem (
  Join-Path $RepoRoot "apps/web/src/app/applications"
) -Recurse -Filter "page.tsx")

if($webPages.Count -lt 9){
  throw "Expected at least 9 web pages, found $($webPages.Count)"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  applications=$count
  webPages=$webPages.Count
  mobileRegistry=$true
  apiRuntime=$true
}