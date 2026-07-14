const baseUrl = process.env.AVOS_API_URL || "http://localhost:3000";
async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { headers: { "content-type": "application/json", ...(options.headers || {}) }, ...options });
  const text = await response.text(); const payload = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`HTTP ${response.status} ${path}: ${JSON.stringify(payload)}`);
  return payload;
}
const status = await request("/enterprise-phase-5-ultra/status");
const smoke = await request("/enterprise-phase-5-ultra/smoke", { method: "POST", body: JSON.stringify({}) });
if (!status?.success || !smoke?.success || smoke?.executionStatus !== "COMPLETED" || smoke?.decisionApproved !== true || smoke?.constitutionCompliant !== true) {
  throw new Error(`Phase 5 Ultra smoke failed: ${JSON.stringify(smoke)}`);
}
console.log(JSON.stringify(smoke, null, 2));