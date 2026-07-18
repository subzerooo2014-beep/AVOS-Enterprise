const baseUrl = "http://localhost:3001";
const routes = ["/auction", "/insurance", "/workshops"];

const results = [];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`);
  results.push({
    route,
    status: response.status,
    ok: response.ok,
  });
}

if (!results.every((item) => item.ok)) {
  throw new Error(`Web App 4.0 smoke failed: ${JSON.stringify(results)}`);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Web App 4.0 Generated Pack",
  passedRoutes: results.filter((item) => item.ok).length,
  totalRoutes: results.length,
  routes,
}, null, 2));
