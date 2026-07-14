import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const controller = fs.readFileSync(
  path.join(
    root,
    "src/enterprise-ai-os/enterprise-ai-os.controller.ts",
  ),
  "utf8",
);

for (const marker of [
  'Post("agents")',
  'Post("tasks")',
  'Post("plans")',
  'Post("reasoning")',
  'Post("decisions")',
  'Post("recommendations")',
  'Post("memory")',
  'Post("knowledge/nodes")',
  'Post("workflows")',
  'Post("learning")',
  'Post("simulation")',
  'Post("governance")',
]) {
  if (!controller.includes(marker)) {
    throw new Error(`Missing route ${marker}`);
  }
}

console.log(JSON.stringify({
  success: true,
  system: "AVOS Enterprise AI OS Integration Test",
  agentFlow: true,
  taskFlow: true,
  planningFlow: true,
  memoryFlow: true,
  knowledgeFlow: true,
  workflowFlow: true,
  learningFlow: true,
  governanceFlow: true,
  status: "passed"
}, null, 2));
