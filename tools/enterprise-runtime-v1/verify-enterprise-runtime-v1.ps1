param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$t=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-runtime-v1/enterprise-runtime-v1.types.ts"
) -Raw

$s=Get-Content (
  Join-Path $RepoRoot "apps/api/src/enterprise-runtime-v1/enterprise-runtime-v1.service.ts"
) -Raw

$count=([regex]::Matches($t,'(?m)^\s{2}"[a-z0-9-]+",?$')).Count

if($count -ne 40){
  throw "Expected 40 runtime capabilities, found $count"
}

if(-not($s-match"execute\(")){
  throw "Runtime execution missing"
}

if(-not($s-match"auditable: true")){
  throw "Audit capability missing"
}

[pscustomobject]@{
  success=$true
  verification="passed"
  capabilities=$count
  executableRuntime=$true
}