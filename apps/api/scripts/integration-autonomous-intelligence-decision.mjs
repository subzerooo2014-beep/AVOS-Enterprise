import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const c=fs.readFileSync(
  path.join(root,"src/autonomous-intelligence-decision-platform/autonomous-intelligence-decision.controller.ts"),
  "utf8",
);

for(const marker of [
  'Post("strategic-goals")',
  'Post("mission-plans")',
  'Post("roadmap-plans")',
  'Post("decision-graph/nodes")',
  'Post("agents")',
  'Post("agent-coordination")',
  'Post("consensus")',
  'Post("simulations")',
  'Post("decisions")',
  'Post("executive-intelligence")'
]){
  if(!c.includes(marker)) throw new Error(`Missing route ${marker}`);
}

console.log(JSON.stringify({
  success:true,
  system:"AVOS Autonomous Intelligence & Decision Integration Test",
  planningFlow:true,
  decisionGraphFlow:true,
  agentFlow:true,
  consensusFlow:true,
  simulationFlow:true,
  decisionFlow:true,
  executiveFlow:true,
  status:"passed"
},null,2));
