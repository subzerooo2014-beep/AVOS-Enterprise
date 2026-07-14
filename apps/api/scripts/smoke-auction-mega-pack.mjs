const apiUrl = process.env.AVOS_API_URL || "http://localhost:3000";
const webUrl = process.env.AVOS_WEB_URL || "http://localhost:3001";

async function readJson(url, options = {}) {
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

const apiSmoke = await readJson(`${apiUrl}/auction-v2/smoke/run`, {
  method: "POST",
  body: JSON.stringify({}),
});

const routes = ["/auction", "/auction/land-cruiser-live"];
const webResults = [];

for (const route of routes) {
  const response = await fetch(`${webUrl}${route}`);
  webResults.push({ route, status: response.status, ok: response.ok });
}

if (
  !apiSmoke?.success ||
  apiSmoke?.auctionStatus !== "ENDED" ||
  apiSmoke?.winnerSelected !== true ||
  !webResults.every((item) => item.ok)
) {
  throw new Error(
    `AVOS Auction smoke failed: ${JSON.stringify({ apiSmoke, webResults })}`,
  );
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: "AVOS Auction Mega Pack",
      integrationStatus: "running",
      auctionStatus: apiSmoke.auctionStatus,
      bidCount: apiSmoke.bidCount,
      reserveMet: apiSmoke.reserveMet,
      winnerSelected: apiSmoke.winnerSelected,
      winningAmount: apiSmoke.winningAmount,
      passedWebRoutes: webResults.filter((item) => item.ok).length,
      totalWebRoutes: webResults.length,
      capabilities: apiSmoke.capabilities,
    },
    null,
    2,
  ),
);