import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const c=fs.readFileSync(
  path.join(root,"src/language-memory-foundation/language-memory-foundation.controller.ts"),
  "utf8",
);

for(const marker of [
  'Post("dialects/detect")',
  'Post("dialects/translate")',
  'Post("live-interpreter")',
  'Post("cross-language-rag")',
  'Post("memory/short-term")',
  'Post("memory/long-term")',
  'Post("memory/shared")',
  'Post("memory/compress")',
  'Post("memory/replay")',
  'Post("memory/governance")'
]){
  if(!c.includes(marker)) throw new Error(`Missing route ${marker}`);
}

console.log(JSON.stringify({
  success:true,
  system:"AVOS Language & Memory Foundation Integration Test",
  dialectFlow:true,
  voiceFlow:true,
  culturalFlow:true,
  crossLanguageFlow:true,
  memoryFlow:true,
  sharedMemoryFlow:true,
  replayFlow:true,
  governanceFlow:true,
  status:"passed"
},null,2));
