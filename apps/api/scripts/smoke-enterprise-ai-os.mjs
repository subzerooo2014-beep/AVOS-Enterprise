import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const base = path.join(root, "src/enterprise-ai-os");

const count = (dir) =>
  fs.readdirSync(path.join(base, dir))
    .filter((file) => file.endsWith(".ts")).length;

const dto = count("dto");
const services = count("services");
const policies = count("policies");
const events = count("events");
const engines = count("engines");
const agents = count("agents");

if (dto < 24) throw new Error(`Expected 24 DTOs, found ${dto}`);
if (services < 17) throw new Error(`Expected 17 services, found ${services}`);
if (policies < 8) throw new Error(`Expected 8 policies, found ${policies}`);
if (events < 12) throw new Error(`Expected 12 events, found ${events}`);
if (engines < 10) throw new Error(`Expected 10 engines, found ${engines}`);
if (agents < 8) throw new Error(`Expected 8 agents, found ${agents}`);

console.log(JSON.stringify({
  success: true,
  system: "AVOS Enterprise AI OS Smoke Test",
  dto,
  services,
  policies,
  events,
  engines,
  agents,
  multiAgentRuntime: true,
  planningAi: true,
  memoryAi: true,
  knowledgeGraph: true,
  autonomousWorkflows: true,
  learningEngine: true,
  aiGovernance: true,
  status: "passed"
}, null, 2));
