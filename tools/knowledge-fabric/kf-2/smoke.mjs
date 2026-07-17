import fs from "node:fs";
import path from "node:path";
const root=path.join(process.cwd(),"apps/api/src/knowledge-fabric/runtime");
const controller=fs.readFileSync(path.join(root,"knowledge-runtime.controller.ts"),"utf8");
const engine=fs.readFileSync(path.join(root,"knowledge-runtime-engine.service.ts"),"utf8");
const checks={
 statusRoute:controller.includes('@Get("status")'), healthRoute:controller.includes('@Get("health")'),
 queryRoute:controller.includes('@Post("query")'), executeRoute:controller.includes('@Post("execute")'),
 sessionRoute:controller.includes('@Get("sessions/:id")'), cacheInvalidationRoute:controller.includes('@Post("cache/invalidate")'),
 runtimeSessions:engine.includes("sessions.create"), knowledgeResolution:engine.includes("resolver.resolve"),
 retrievalPipeline:engine.includes("retrieval.retrieve"), contextAssembly:engine.includes("contexts.build"),
 runtimeEvents:engine.includes("events.emit"), runtimeMetrics:engine.includes("metrics.completed")
};
const failed=Object.entries(checks).filter(([,ok])=>!ok).map(([name])=>name);
if(failed.length) throw new Error(`KF-2 smoke failed: ${failed.join(", ")}`);
console.log(JSON.stringify({success:true,system:"AVOS Knowledge Fabric",pack:"KF-2 Knowledge Runtime",smokeTest:"passed",checks,checkCount:Object.keys(checks).length,nextPack:"KF-3 Knowledge Intelligence"},null,2));