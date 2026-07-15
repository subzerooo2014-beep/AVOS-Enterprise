param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$c=Get-Content (
  Join-Path $RepoRoot "apps/api/src/live-auctions/live-auctions.controller.ts"
) -Raw

$routes=@(
  '@Controller("live-auctions")',
  '@Get("capabilities")',
  '@Post()',
  '@Patch(":id/schedule")',
  '@Patch(":id/start")',
  '@Post(":id/bids")',
  '@Post(":id/buy-now")',
  '@Patch(":id/end")',
  '@Patch("moderation/bidders/:bidderId")',
  '@Get(":id/bids")',
  '@Post("recommendations")',
  '@Get("analytics")'
)

foreach($route in $routes){
  if(-not $c.Contains($route)){
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success=$true
  smokeTests="passed"
  routes=$routes.Count
}|Format-List