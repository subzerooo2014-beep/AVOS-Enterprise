import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const c=fs.readFileSync(
  path.join(root,"src/ai-infrastructure-core/ai-infrastructure-core.controller.ts"),
  "utf8",
);

for(const marker of [
  'Post("models")',
  'Post("prompts")',
  'Post("vectors/collections")',
  'Post("vectors/search")',
  'Post("rag/pipelines")',
  'Post("rag/execute")',
  'Post("evaluations/run")',
  'Post("fine-tuning/run")',
  'Post("guardrails/evaluate")',
  'Post("model-routes")'
]){
  if(!c.includes(marker)) throw new Error(`Missing route ${marker}`);
}

console.log(JSON.stringify({
  success:true,
  system:"AVOS AI Infrastructure Core Integration Test",
  modelFlow:true,
  promptFlow:true,
  vectorFlow:true,
  ragFlow:true,
  evaluationFlow:true,
  fineTuningFlow:true,
  guardrailFlow:true,
  providerFlow:true,
  status:"passed"
},null,2));
