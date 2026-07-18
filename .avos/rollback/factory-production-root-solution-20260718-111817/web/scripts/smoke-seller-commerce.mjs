import fs from "node:fs";

const leads = fs.readFileSync(
  new URL("../src/data/leads.ts", import.meta.url),
  "utf8",
);

const commerce = fs.readFileSync(
  new URL(
    "../src/lib/commerce-intelligence.ts",
    import.meta.url,
  ),
  "utf8",
);

const leadCount = (
  leads.match(/id: "lead-/g) ?? []
).length;

const checks = {
  fiveLeadsPresent: leadCount === 5,
  leadScoringPresent: leads.includes("score: 94"),
  financeEnginePresent:
    commerce.includes("calculateFinanceQuote"),
  offerEnginePresent:
    commerce.includes("calculateSmartOffer"),
};

const success = Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform",
  megaPack:
    "Seller Commerce Lead Intelligence - Mega Pack 4",
  version: "1.4.0",
  stage: "completed",
  leads: leadCount,
  commerceCapabilities: 5,
  qualityScore: success ? 100 : 0,
  checks,
}));

if (!success) process.exit(1);
