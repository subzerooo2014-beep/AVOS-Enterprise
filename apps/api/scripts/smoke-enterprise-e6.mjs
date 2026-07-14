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

const status = await request("/enterprise-e6/status");
const smoke = await request("/enterprise-e6/smoke", {
  method: "POST",
  body: JSON.stringify({ source: "enterprise-e6-smoke" }),
});

if (!status?.success) {
  throw new Error("E6 status endpoint did not report success.");
}

if (
  !smoke?.success ||
  smoke?.operationStatus !== "COMPLETED" ||
  smoke?.remediationStatus !== "COMPLETED"
) {
  throw new Error(`E6 smoke failed: ${JSON.stringify(smoke)}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: smoke.system,
      integrationStatus: smoke.integrationStatus,
      operationStatus: smoke.operationStatus,
      anomalyDetected: smoke.anomalyDetected,
      remediationStatus: smoke.remediationStatus,
      autonomousOperations: smoke.autonomousOperations,
      selfHealingReadiness: smoke.selfHealingReadiness,
      capabilities: smoke.capabilities,
    },
    null,
    2,
  ),
);