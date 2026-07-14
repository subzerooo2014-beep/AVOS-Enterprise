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
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${path}: ${JSON.stringify(payload)}`);
  }

  return payload;
}

const status = await request("/enterprise-final-ultra/status");
const smoke = await request("/enterprise-final-ultra/smoke", {
  method: "POST",
  body: JSON.stringify({}),
});

if (
  !status?.success ||
  !smoke?.success ||
  smoke?.executionStatus !== "COMPLETED" ||
  smoke?.boardApproved !== true ||
  smoke?.certificationPassed !== true ||
  smoke?.productionLocked !== true
) {
  throw new Error(`Final Ultra smoke failed: ${JSON.stringify(smoke)}`);
}

console.log(JSON.stringify(smoke, null, 2));