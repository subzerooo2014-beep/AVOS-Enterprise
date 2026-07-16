function Test-BlueprintCompatibilityV3 {
  param([Parameter(Mandatory)]$Blueprint)

  $issues = New-Object System.Collections.Generic.List[string]

  if ([string]$Blueprint.schemaVersion -notin @("2.0","3.0")) {
    $issues.Add("Unsupported schemaVersion")
  }

  if (@($Blueprint.entities).Count -eq 0) {
    $issues.Add("No entities defined")
  }

  if (@($Blueprint.capabilities).Count -eq 0) {
    $issues.Add("No capabilities defined")
  }

  [pscustomobject]@{
    compatible = $issues.Count -eq 0
    issues = $issues
  }
}