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

const status = await request("/avos-product-final/status");
const smoke = await request("/avos-product-final/smoke", {
  method: "POST",
  body: JSON.stringify({}),
});

if (
  !status?.success ||
  !smoke?.success ||
  smoke?.executionStatus !== "COMPLETED" ||
  smoke?.certificationPassed !== true
) {
  throw new Error(`AVOS Product Final smoke failed: ${JSON.stringify(smoke)}`);
}

console.log(JSON.stringify(smoke, null, 2));