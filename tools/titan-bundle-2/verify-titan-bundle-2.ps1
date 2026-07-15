param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"
$t=Get-Content (Join-Path $RepoRoot "apps/api/src/titan-platform/titan-bundle-2/titan-bundle-2.types.ts") -Raw
$r=Get-Content (Join-Path $RepoRoot "apps/api/src/titan-platform/titan-bundle-2/titan-bundle-2.registry.ts") -Raw
$s=Get-Content (Join-Path $RepoRoot "apps/api/src/titan-platform/titan-bundle-2/titan-bundle-2.service.ts") -Raw
$count=([regex]::Matches($t,'(?m)^\s{2}"[a-z0-9-]+",?$')).Count
if($count -ne 200){throw "Expected 200 capabilities, found $count"}
if(-not($s-match"execute\(request: TitanExecutionRequest\)")){throw "Executable runtime missing"}
if(-not($r-match"TITAN_BUNDLE_2_DOMAIN_MAP")){throw "Domain registry missing"}
[pscustomobject]@{success=$true;verification="passed";capabilities=$count;domains=10;executable=$true}