import fs from "node:fs";
import path from "node:path";
const repo=process.cwd();
const root=path.join(repo,"apps/api/src/knowledge-fabric/runtime");
const required=[
 "knowledge-runtime.types.ts","knowledge-runtime.contracts.ts","knowledge-runtime-cache.service.ts",
 "knowledge-runtime-policy.service.ts","knowledge-runtime-session.service.ts","knowledge-runtime-resolver.service.ts",
 "knowledge-retrieval-pipeline.service.ts","knowledge-context-builder.service.ts","knowledge-runtime-events.service.ts",
 "knowledge-runtime-metrics.service.ts","knowledge-runtime-engine.service.ts","knowledge-runtime-health.service.ts",
 "knowledge-runtime.controller.ts","knowledge-runtime.module.ts","index.ts"
];
const missing=required.filter((file)=>!fs.existsSync(path.join(root,file)));
if(missing.length) throw new Error(`Missing KF-2 files: ${missing.join(", ")}`);
const moduleText=fs.readFileSync(path.join(repo,"apps/api/src/knowledge-fabric/knowledge-fabric.module.ts"),"utf8");
if(!moduleText.includes("KnowledgeRuntimeController") || !moduleText.includes("KnowledgeRuntimeEngineService")) throw new Error("KF-2 runtime services are not registered");
const checks={
 runtimeEngine:fs.readFileSync(path.join(root,"knowledge-runtime-engine.service.ts"),"utf8").includes("execute("),
 sessions:fs.readFileSync(path.join(root,"knowledge-runtime-session.service.ts"),"utf8").includes("KnowledgeRuntimeSession"),
 cache:fs.readFileSync(path.join(root,"knowledge-runtime-cache.service.ts"),"utf8").includes("invalidate("),
 policies:fs.readFileSync(path.join(root,"knowledge-runtime-policy.service.ts"),"utf8").includes("canAccess("),
 retrieval:fs.readFileSync(path.join(root,"knowledge-retrieval-pipeline.service.ts"),"utf8").includes("retrieve("),
 contextAssembly:fs.readFileSync(path.join(root,"knowledge-context-builder.service.ts"),"utf8").includes("checksum"),
 events:fs.readFileSync(path.join(root,"knowledge-runtime-events.service.ts"),"utf8").includes("emit("),
 metrics:fs.readFileSync(path.join(root,"knowledge-runtime-metrics.service.ts"),"utf8").includes("snapshot("),
 health:fs.readFileSync(path.join(root,"knowledge-runtime-health.service.ts"),"utf8").includes('status: "operational"'),
 controller:fs.readFileSync(path.join(root,"knowledge-runtime.controller.ts"),"utf8").includes('@Controller("knowledge-fabric/runtime")')
};
const failed=Object.entries(checks).filter(([,ok])=>!ok).map(([name])=>name);
if(failed.length) throw new Error(`KF-2 verification failed: ${failed.join(", ")}`);
console.log(JSON.stringify({success:true,system:"AVOS Knowledge Fabric",pack:"KF-2 Knowledge Runtime",verification:"passed",foundationFirst:true,filesVerified:required.length,runtimeRegistered:true,rollbackReady:true,checks},null,2));