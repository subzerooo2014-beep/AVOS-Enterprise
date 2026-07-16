function New-DependencyGraphV3 {
  param([Parameter(Mandatory)]$Blueprint)

  $nodes = New-Object System.Collections.Generic.List[object]

  foreach ($entity in @($Blueprint.entities)) {
    $nodes.Add([pscustomobject]@{
      id = [string]$entity.name
      type = "ENTITY"
      dependencies = @()
    })
  }

  $nodes.Add([pscustomobject]@{
    id = [string]$Blueprint.moduleSlug
    type = "MODULE"
    dependencies = @($Blueprint.entities.name)
  })

  return [pscustomobject]@{
    module = $Blueprint.moduleSlug
    nodes = $nodes
    nodeCount = $nodes.Count
  }
}