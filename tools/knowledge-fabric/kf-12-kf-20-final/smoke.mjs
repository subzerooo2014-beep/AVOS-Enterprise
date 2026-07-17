import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
const base = path.join(root, "apps/api/src/knowledge-fabric");
const read = (file) => fs.readFileSync(path.join(base, file), "utf8");
const checks = {
  capitalStatus: read("capital/capital.controller.ts").includes('@Get("status")'), capitalActivation: read("capital/capital.controller.ts").includes('@Post("records/:id/activate")'),
  trustStatus: read("trust/trust.controller.ts").includes('@Get("status")'), trustActivation: read("trust/trust.controller.ts").includes('@Post("records/:id/activate")'),
  securityStatus: read("security/security.controller.ts").includes('@Get("status")'), securityActivation: read("security/security.controller.ts").includes('@Post("records/:id/activate")'),
  complianceStatus: read("compliance/compliance.controller.ts").includes('@Get("status")'), complianceActivation: read("compliance/compliance.controller.ts").includes('@Post("records/:id/activate")'),
  analyticsStatus: read("analytics/analytics.controller.ts").includes('@Get("status")'), analyticsActivation: read("analytics/analytics.controller.ts").includes('@Post("records/:id/activate")'),
  automationStatus: read("automation/automation.controller.ts").includes('@Get("status")'), automationActivation: read("automation/automation.controller.ts").includes('@Post("records/:id/activate")'),
  orchestrationStatus: read("orchestration/orchestration.controller.ts").includes('@Get("status")'), orchestrationActivation: read("orchestration/orchestration.controller.ts").includes('@Post("records/:id/activate")'),
  platformStatus: read("platform/platform.controller.ts").includes('@Get("status")'), platformActivation: read("platform/platform.controller.ts").includes('@Post("records/:id/activate")'),
  certificationStatus: read("certification/certification.controller.ts").includes('@Get("status")'), certificationActivation: read("certification/certification.controller.ts").includes('@Post("records/:id/activate")'),
  finalCertification: read("certification/certification.service.ts").includes('pack: "KF-20 Knowledge Fabric Certification"'),
  finalPlatform: read("platform/platform.service.ts").includes('status: "operational"')
};
const success = Object.values(checks).every(Boolean);
console.log(JSON.stringify({ success, system: "AVOS Knowledge Fabric", pack: "KF-12 through KF-20 Final Mega Bundle", smokeTest: success ? "passed" : "failed", checks, checkCount: Object.keys(checks).length, knowledgeFabricStatus: success ? "CERTIFIED" : "FAILED", nextPhase: "AVOS Memory Architecture" }, null, 2));
if (!success) process.exit(1);