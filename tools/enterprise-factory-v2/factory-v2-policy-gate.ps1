[CmdletBinding()]
param(
  [Parameter(Mandatory)][string]$BlueprintPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$blueprint = Get-Content -LiteralPath $BlueprintPath -Raw | ConvertFrom-Json
$issues = New-Object System.Collections.Generic.List[string]

if (@($blueprint.capabilities).Count -lt 5) {
  $issues.Add("At least five capabilities are required.")
}

if (@($blueprint.entities).Count -lt 2) {
  $issues.Add("At least two entities are required.")
}

if ([string]$blueprint.schemaVersion -ne "2.0") {
  $issues.Add("schemaVersion must be 2.0 for the current generation layer.")
}

[pscustomobject]@{
  allowed = $issues.Count -eq 0
  issues = $issues
} | Format-List

if ($issues.Count -gt 0) {
  throw "Factory V2 policy gate rejected blueprint."
}