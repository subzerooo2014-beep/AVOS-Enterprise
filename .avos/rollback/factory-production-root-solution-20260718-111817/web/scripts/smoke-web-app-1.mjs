const baseUrl = process.env.AVOS_WEB_URL || "http://localhost:3001";

const routes = ["/", "/vehicles", "/sell", "/dashboard", "/services"];
const results = [];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route}`);
  results.push({
    route,
    status: response.status,
    ok: response.ok,
  });
}

const success = results.every((result) => result.ok);

if (!success) {
  throw new Error(`AVOS Web smoke failed: ${JSON.stringify(results)}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Web App 1.0",
      integrationStatus: "running",
      routes,
      passedRoutes: results.filter((item) => item.ok).length,
      totalRoutes: results.length,
    },
    null,
    2,
  ),
);