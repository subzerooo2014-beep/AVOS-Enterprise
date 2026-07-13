import fs from "node:fs";
const file = "src/core-application-flows/core-flow-rate-limit.service.ts";
const content = fs.readFileSync(file, "utf8");
const checks = {
  legacyExceptionRemoved: !content.includes("TooManyRequestsException"),
  httpExceptionReady: content.includes("HttpException"),
  httpStatusReady: content.includes("HttpStatus.TOO_MANY_REQUESTS"),
  rateLimitMessageReady: content.includes("Core flow rate limit exceeded."),
};
const success = Object.values(checks).every(Boolean);
process.stdout.write(JSON.stringify({
  success,
  system: "AVOS Core Application Flows V1",
  hotfix: "Ultra Bundle B Rate Limit Exception",
  version: "1.45.1",
  checks,
  healthStatus: success ? "healthy" : "unhealthy",
}));
if (!success) process.exit(1);
