$ErrorActionPreference = "Stop"
& (Join-Path $PSScriptRoot "smoke.ps1")
& (Join-Path $PSScriptRoot "verify.ps1")
[pscustomobject]@{ success=$true; system="AVOS Enterprise Innovation and Growth Mega Bundle G8"; integration="PASS" } | Format-List