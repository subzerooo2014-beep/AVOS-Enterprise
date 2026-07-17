import fs from "node:fs";
import path from "node:path";
const root=path.join(process.cwd(),"apps/api/src/knowledge-fabric/governance");
const controller=fs.readFileSync(path.join(root,"knowledge-governance.controller.ts"),"utf8");
const engine=fs.readFileSync(path.join(root,"knowledge-governance-engine.service.ts"),"utf8");
const checks={statusRoute:controller.includes('@Get("status")'),healthRoute:controller.includes('@Get("health")'),metricsRoute:controller.includes('@Get("metrics")'),policiesRoute:controller.includes('@Get("policies")'),evaluateRoute:controller.includes('@Post("evaluate")'),approvalRoute:controller.includes('@Post("approvals/:id/decision")'),auditRoute:controller.includes('@Get("audit")'),retentionRoute:controller.includes('@Post("retention/evaluate")'),lifecycleRoute:controller.includes('@Post("lifecycle/:knowledgeId/transition")'),policyEvaluation:engine.includes("policies.evaluate"),qualityAssessment:engine.includes("quality.assess"),complianceCheck:engine.includes("compliance.check"),approvalWorkflow:engine.includes("approvals.request"),auditTrail:engine.includes("audit.record")};
const failed=Object.entries(checks).filter(([,ok])=>!ok).map(([name])=>name);
if(failed.length) throw new Error(`KF-4 smoke failed: ${failed.join(", ")}`);
console.log(JSON.stringify({success:true,system:"AVOS Knowledge Fabric",pack:"KF-4 Knowledge Governance",smokeTest:"passed",checks,checkCount:Object.keys(checks).length,nextPack:"KF-5 Knowledge Evolution"},null,2));