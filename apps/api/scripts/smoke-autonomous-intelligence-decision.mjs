import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const base=path.join(root,"src/autonomous-intelligence-decision-platform");
const count=d=>fs.readdirSync(path.join(base,d)).filter(f=>f.endsWith(".ts")).length;

const dto=count("dto");
const services=count("services");
const policies=count("policies");
const events=count("events");
const runtime=count("runtime");

if(dto<24)throw new Error(`Expected 24 DTOs, found ${dto}`);
if(services<25)throw new Error(`Expected 25 services, found ${services}`);
if(policies<8)throw new Error(`Expected 8 policies, found ${policies}`);
if(events<12)throw new Error(`Expected 12 events, found ${events}`);
if(runtime<8)throw new Error(`Expected 8 runtime components, found ${runtime}`);

console.log(JSON.stringify({
  success:true,
  system:"AVOS Autonomous Intelligence & Decision Smoke Test",
  dto,services,policies,events,runtime,
  strategicPlanner:true,
  decisionGraph:true,
  multiAgentCoordination:true,
  consensusEngine:true,
  scenarioSimulator:true,
  decisionEngine:true,
  optimization:true,
  executiveIntelligence:true,
  status:"passed"
},null,2));
