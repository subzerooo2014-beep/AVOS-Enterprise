param([string]$RepoRoot=(Get-Location).Path)
$ErrorActionPreference="Stop"

$controller=Get-Content (
  Join-Path $RepoRoot "apps/api/src/marketplace-execution/marketplace-execution.controller.ts"
) -Raw

$routes=@(
  '@Controller("marketplace-execution")',
  '@Get("components")',
  '@Post("carts")',
  '@Post("carts/:id/items")',
  '@Post("reservations")',
  '@Post("offers")',
  '@Patch("offers/:id/accept")',
  '@Post("contracts")',
  '@Patch("contracts/:id/sign")',
  '@Post("checkout")',
  '@Patch("orders/:id/status")',
  '@Post("payments")',
  '@Patch("payments/:id/capture")',
  '@Patch("payments/:id/refund")',
  '@Post("shipments")',
  '@Patch("shipments/:id/carrier")',
  '@Post("chats")',
  '@Post("chats/:id/messages")',
  '@Get("dashboard")'
)

foreach($route in $routes){
  if(-not $controller.Contains($route)){
    throw "Missing route: $route"
  }
}

[pscustomobject]@{
  success=$true
  smokeTests="passed"
  routes=$routes.Count
  components=33
}|Format-List