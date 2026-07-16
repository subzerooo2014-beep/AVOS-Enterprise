function New-MigrationPlanV3 {
  param([Parameter(Mandatory)]$Blueprint)

  [pscustomobject]@{
    module = $Blueprint.moduleSlug
    entities = @($Blueprint.entities.name)
    strategy = "ADDITIVE_SAFE"
    requiresManualReview = $false
    generatedAt = (Get-Date).ToString("o")
  }
}