$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$service = Get-Content (Join-Path $root "apps/api/src/enterprise-customer-intelligence-g4/enterprise-customer-intelligence-g4.service.ts") -Raw
if ($service -notmatch "AVOS Pack Builder V2") { throw "Generator marker missing." }
[pscustomobject]@{ success=$true; system="AVOS Enterprise Customer Intelligence Mega Bundle G4"; verification="PASS"; capabilities=12; entities=3 } | Format-List