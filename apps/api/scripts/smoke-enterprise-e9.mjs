const baseUrl = process.env.AVOS_API_URL || "http://localhost:3000";

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "content-type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let payload;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { raw: text };
  }

  if (!response.ok) {
    throw new Error(
      `HTTP ${response.status} ${path}: ${JSON.stringify(payload)}`,
    );
  }

  return payload;
}

const status = await request("/enterprise-e9/status");
const smoke = await request("/enterprise-e9/smoke", {
  method: "POST",
  body: JSON.stringify({}),
});

if (!status?.success) {
  throw new Error("E9 status endpoint did not report success.");
}

if (
  !smoke?.success ||
  smoke?.strategyStatus !== "APPROVED" ||
  smoke?.governanceApproved !== true ||
  smoke?.executionWaveApproved !== true
) {
  throw new Error(`E9 smoke failed: ${JSON.stringify(smoke)}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: smoke.system,
      integrationStatus: smoke.integrationStatus,
      strategyStatus: smoke.strategyStatus,
      governanceApproved: smoke.governanceApproved,
      executionWaveApproved: smoke.executionWaveApproved,
      executionWaveReadiness: smoke.executionWaveReadiness,
      portfolioValueScore: smoke.portfolioValueScore,
      strategyReadiness: smoke.strategyReadiness,
      activeInitiatives: smoke.activeInitiatives,
      capabilities: smoke.capabilities,
    },
    null,
    2,
  ),
);