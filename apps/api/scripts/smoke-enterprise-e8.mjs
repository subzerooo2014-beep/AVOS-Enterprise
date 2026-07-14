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

const status = await request("/enterprise-e8/status");
const smoke = await request("/enterprise-e8/smoke", {
  method: "POST",
  body: JSON.stringify({}),
});

if (!status?.success) {
  throw new Error("E8 status endpoint did not report success.");
}

if (
  !smoke?.success ||
  smoke?.decisionStatus !== "EXECUTED" ||
  smoke?.policyAllowed !== true
) {
  throw new Error(`E8 smoke failed: ${JSON.stringify(smoke)}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: smoke.system,
      integrationStatus: smoke.integrationStatus,
      decisionStatus: smoke.decisionStatus,
      policyAllowed: smoke.policyAllowed,
      decisionAction: smoke.decisionAction,
      decisionConfidence: smoke.decisionConfidence,
      resilienceScore: smoke.resilienceScore,
      decisionReadiness: smoke.decisionReadiness,
      executedDecisions: smoke.executedDecisions,
      capabilities: smoke.capabilities,
    },
    null,
    2,
  ),
);