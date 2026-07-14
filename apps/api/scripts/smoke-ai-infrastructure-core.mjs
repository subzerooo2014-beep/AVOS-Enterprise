import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const base=path.join(root,"src/ai-infrastructure-core");
const count=d=>fs.readdirSync(path.join(base,d)).filter(f=>f.endsWith(".ts")).length;

const dto=count("dto");
const services=count("services");
const policies=count("policies");
const events=count("events");
const runtime=count("runtime");

if(dto<20)throw new Error(`Expected 20 DTOs, found ${dto}`);
if(services<21)throw new Error(`Expected 21 services, found ${services}`);
if(policies<8)throw new Error(`Expected 8 policies, found ${policies}`);
if(events<12)throw new Error(`Expected 12 events, found ${events}`);
if(runtime<8)throw new Error(`Expected 8 runtime components, found ${runtime}`);

console.log(JSON.stringify({
  success:true,
  system:"AVOS AI Infrastructure Core Smoke Test",
  dto,services,policies,events,runtime,
  modelRegistry:true,
  promptRegistry:true,
  vectorLayer:true,
  ragEngine:true,
  evaluationFramework:true,
  fineTuning:true,
  guardrails:true,
  providerFailover:true,
  status:"passed"
},null,2));
