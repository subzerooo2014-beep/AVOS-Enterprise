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

const status = await request("/enterprise-e5/status");
const smoke = await request("/enterprise-e5/smoke", {
  method: "POST",
  body: JSON.stringify({ source: "enterprise-e5-smoke" }),
});

if (!status?.success) {
  throw new Error("E5 status endpoint did not report success.");
}

if (!smoke?.success || smoke?.executionStatus !== "COMPLETED") {
  throw new Error(`E5 smoke failed: ${JSON.stringify(smoke)}`);
}

console.log(
  JSON.stringify(
    {
      success: true,
      system: smoke.system,
      integrationStatus: smoke.integrationStatus,
      executionStatus: smoke.executionStatus,
      eventMesh: smoke.eventMesh,
      commandBus: smoke.commandBus,
      scheduler: smoke.scheduler,
      circuitState: smoke.circuitState,
      discoveredServices: smoke.discoveredServices,
      healthyServices: smoke.healthyServices,
      capabilities: smoke.capabilities,
    },
    null,
    2,
  ),
);