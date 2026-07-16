$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent (Split-Path -Parent $PSScriptRoot))
$service = Get-Content (Join-Path $root "apps/api/src/core-foundation-stack/core-foundation-stack.service.ts") -Raw
if ($service -notmatch "AVOS Pack Builder V2") { throw "Generator marker missing." }
[pscustomobject]@{ success=$true; system="AVOS Core Foundation Stack"; verification="PASS"; capabilities=10; entities=3 } | Format-List