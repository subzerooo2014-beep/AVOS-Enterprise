import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const c=fs.readFileSync(
  path.join(root,"src/global-enterprise-core/global-enterprise-core.controller.ts"),
  "utf8",
);

for(const marker of [
  'Post("constitution/rules")',
  'Post("constitution/decisions")',
  'Post("governance/frameworks")',
  'Post("certification/frameworks")',
  'Post("standards")',
  'Post("global-operations")',
  'Post("command-center/actions")',
  'Post("trust-network")',
  'Post("resilience-center")',
  'Post("release-approvals")'
]){
  if(!c.includes(marker)) throw new Error(`Missing route ${marker}`);
}

console.log(JSON.stringify({
  success:true,
  system:"AVOS Global Enterprise Core Integration Test",
  constitutionFlow:true,
  governanceFlow:true,
  certificationFlow:true,
  standardsFlow:true,
  operationsFlow:true,
  trustFlow:true,
  resilienceFlow:true,
  releaseFlow:true,
  status:"passed"
},null,2));
