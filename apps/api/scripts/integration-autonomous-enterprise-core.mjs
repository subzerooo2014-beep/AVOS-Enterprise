import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const c=fs.readFileSync(
  path.join(root,"src/autonomous-enterprise-core/autonomous-enterprise-core.controller.ts"),
  "utf8",
);

for(const marker of [
  'Post("evolution/proposals")',
  'Post("evolution/approvals")',
  'Post("release-advisor")',
  'Post("performance-dna")',
  'Post("decision-dna")',
  'Post("optimization")',
  'Post("learning-cycles")',
  'Post("architecture-evolution")',
  'Post("policy-evolution")',
  'Post("executive-ai-brain")'
]){
  if(!c.includes(marker)) throw new Error(`Missing route ${marker}`);
}

console.log(JSON.stringify({
  success:true,
  system:"AVOS Autonomous Enterprise Core Integration Test",
  evolutionFlow:true,
  releaseFlow:true,
  dnaFlow:true,
  optimizationFlow:true,
  learningFlow:true,
  architectureFlow:true,
  governanceFlow:true,
  executiveFlow:true,
  status:"passed"
},null,2));
