$ErrorActionPreference = "Stop"
& (Join-Path $PSScriptRoot "smoke.ps1")
& (Join-Path $PSScriptRoot "verify.ps1")
[pscustomobject]@{ success=$true; system="AVOS Foundation Governance and Conformance"; integration="PASS" } | Format-List