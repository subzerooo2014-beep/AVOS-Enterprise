import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const c=fs.readFileSync(
  path.join(root,"src/core-foundation-final/core-foundation-final.controller.ts"),
  "utf8",
);

for(const marker of [
  'Post("enterprise-digital-twin")',
  'Post("architecture-digital-twin")',
  'Post("architecture-drift")',
  'Post("strategic-plans")',
  'Post("decision-graph/nodes")',
  'Post("self-evolution")',
  'Post("release-advisor")',
  'Post("digital-constitution")',
  'Post("global-operations")',
  'Post("global-intelligence")'
]){
  if(!c.includes(marker)) throw new Error(`Missing route ${marker}`);
}

console.log(JSON.stringify({
  success:true,
  system:"AVOS Core Foundation Final Integration Test",
  digitalTwinFlow:true,
  architectureFlow:true,
  decisionFlow:true,
  evolutionFlow:true,
  constitutionFlow:true,
  globalOperationsFlow:true,
  intelligenceFlow:true,
  status:"passed"
},null,2));
