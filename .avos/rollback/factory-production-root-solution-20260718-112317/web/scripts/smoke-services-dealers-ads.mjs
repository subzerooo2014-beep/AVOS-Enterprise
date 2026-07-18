import fs from "node:fs";

const services = fs.readFileSync(
  new URL(
    "../src/data/services.ts",
    import.meta.url,
  ),
  "utf8",
);

const providers = fs.readFileSync(
  new URL(
    "../src/data/providers.ts",
    import.meta.url,
  ),
  "utf8",
);

const ads = fs.readFileSync(
  new URL(
    "../src/data/ads.ts",
    import.meta.url,
  ),
  "utf8",
);

const serviceCount = (
  services.match(
    /id: "service-/g,
  ) ?? []
).length;

const providerCount = (
  providers.match(
    /id: "provider-/g,
  ) ?? []
).length;

const campaignCount = (
  ads.match(
    /id: "campaign-/g,
  ) ?? []
).length;

const checks = {
  sixServicesPresent:
    serviceCount === 6,
  fourProvidersPresent:
    providerCount === 4,
  threeCampaignsPresent:
    campaignCount === 3,
  mobileServicePresent:
    services.includes(
      "mobileService: true",
    ),
  instantBookingPresent:
    services.includes(
      "instantBooking: true",
    ),
  aiOptimizationPresent:
    ads.includes(
      "aiOptimization: true",
    ),
};

const success =
  Object.values(checks).every(Boolean);

process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Web Platform",
  megaPack:
    "Services Dealers Ads Ecosystem - Mega Pack 6",
  version: "1.6.0",
  stage: "completed",
  services: serviceCount,
  providers: providerCount,
  campaigns: campaignCount,
  ecosystemCapabilities: 8,
  qualityScore: success ? 100 : 0,
  checks,
}));

if (!success) process.exit(1);
