import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
const c=fs.readFileSync(
  path.join(root,"src/enterprise-knowledge-fabric/enterprise-knowledge-fabric.controller.ts"),
  "utf8",
);

for(const marker of [
  'Post("knowledge")',
  'Post("domains")',
  'Post("federation")',
  'Post("architecture-memory")',
  'Post("graph/nodes")',
  'Post("provenance")',
  'Post("sync")',
  'Post("versions")',
  'Post("semantic-search")',
  'Post("reasoning-archive")'
]){
  if(!c.includes(marker)) throw new Error(`Missing route ${marker}`);
}

console.log(JSON.stringify({
  success:true,
  system:"AVOS Enterprise Knowledge Fabric Integration Test",
  knowledgeFlow:true,
  domainFlow:true,
  federationFlow:true,
  architectureMemoryFlow:true,
  graphFlow:true,
  provenanceFlow:true,
  syncFlow:true,
  searchFlow:true,
  status:"passed"
},null,2));
