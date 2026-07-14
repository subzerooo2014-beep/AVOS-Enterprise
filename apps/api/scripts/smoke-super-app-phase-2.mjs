const apiUrl = process.env.AVOS_API_URL || "http://localhost:3000";

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

const result = await json(`${apiUrl}/super-app-v2/smoke`, {
  method: "POST",
  body: JSON.stringify({}),
});

if (
  !result?.success ||
  result?.workflowStatus !== "COMPLETED" ||
  result?.completedAgents !== 7
) {
  throw new Error(`AVOS Super App Phase 2 smoke failed: ${JSON.stringify(result)}`);
}

console.log(JSON.stringify(result, null, 2));