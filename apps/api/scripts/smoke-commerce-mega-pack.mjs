const apiUrl = process.env.AVOS_API_URL || "http://localhost:3000";
const webUrl = process.env.AVOS_WEB_URL || "http://localhost:3001";

async function json(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${url}: ${JSON.stringify(payload)}`);
  }

  return payload;
}

const apiSmoke = await json(`${apiUrl}/commerce-v1/smoke`, {
  method: "POST",
  body: JSON.stringify({}),
});

const routes = [
  "/insurance",
  "/finance",
  "/workshops",
  "/export",
  "/payments",
  "/commerce-notifications",
];

const webResults = [];

for (const route of routes) {
  const response = await fetch(`${webUrl}${route}`);
  webResults.push({ route, status: response.status, ok: response.ok });
}

if (
  !apiSmoke?.success ||
  apiSmoke?.paymentStatus !== "COMPLETED" ||
  !webResults.every((item) => item.ok)
) {
  throw new Error(
    `AVOS Commerce smoke failed: ${JSON.stringify({ apiSmoke, webResults })}`,
  );
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Commerce Mega Pack",
      integrationStatus: "running",
      insuranceStatus: apiSmoke.insuranceStatus,
      financeStatus: apiSmoke.financeStatus,
      workshopStatus: apiSmoke.workshopStatus,
      shipmentStatus: apiSmoke.shipmentStatus,
      paymentStatus: apiSmoke.paymentStatus,
      notifications: apiSmoke.notifications,
      passedWebRoutes: webResults.filter((item) => item.ok).length,
      totalWebRoutes: webResults.length,
      capabilities: apiSmoke.capabilities,
    },
    null,
    2,
  ),
);