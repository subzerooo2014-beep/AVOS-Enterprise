function Get-ImpactAnalysisV3 {
  param(
    [Parameter(Mandatory)]$Blueprint,
    [Parameter(Mandatory)][string]$RepoRoot
  )

  $slug = [string]$Blueprint.moduleSlug

  $targets = @(
    "apps/api/src/$slug",
    "apps/web/src/app/$slug",
    "apps/mobile/lib/features/$($slug.Replace('-','_'))",
    "docs/generated/$slug",
    "tools/generated/$slug"
  )

  [pscustomobject]@{
    module = $slug
    affectedTargets = $targets
    existingTargets = @(
      $targets | Where-Object {
        Test-Path -LiteralPath (Join-Path $RepoRoot $_)
      }
    )
  }
}