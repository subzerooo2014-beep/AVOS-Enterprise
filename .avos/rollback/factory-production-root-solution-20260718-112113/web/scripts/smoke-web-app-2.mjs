const baseUrl = process.env.AVOS_WEB_URL || "http://localhost:3001";
const routes = [
  "/",
  "/vehicles",
  "/vehicles/land-cruiser-2024",
  "/favorites",
  "/messages",
  "/finance",
  "/dashboard",
];

const results = [];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`);
  results.push({ route, status: response.status, ok: response.ok });
}

if (!results.every((item) => item.ok)) {
  throw new Error(`AVOS Web App 2.0 smoke failed: ${JSON.stringify(results)}`);
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Web App 2.0 Mega Product Pack",
  integrationStatus: "running",
  passedRoutes: results.filter((item) => item.ok).length,
  totalRoutes: results.length,
  routes,
}, null, 2));