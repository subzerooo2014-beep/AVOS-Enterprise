function Test-AIBlueprintV3 {
  param([Parameter(Mandatory)]$Blueprint)

  $score = 100
  $warnings = New-Object System.Collections.Generic.List[string]

  if (@($Blueprint.capabilities).Count -lt 5) {
    $score -= 15
    $warnings.Add("Capability coverage is low")
  }

  if (@($Blueprint.entities).Count -lt 2) {
    $score -= 15
    $warnings.Add("Entity coverage is low")
  }

  [pscustomobject]@{
    valid = $score -ge 70
    qualityScore = $score
    warnings = $warnings
  }
}