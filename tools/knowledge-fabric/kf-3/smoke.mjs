import fs from "node:fs";
import path from "node:path";
const root=path.join(process.cwd(),"apps/api/src/knowledge-fabric/intelligence");
const controller=fs.readFileSync(path.join(root,"knowledge-intelligence.controller.ts"),"utf8");
const engine=fs.readFileSync(path.join(root,"knowledge-intelligence-engine.service.ts"),"utf8");
const checks={statusRoute:controller.includes('@Get("status")'),healthRoute:controller.includes('@Get("health")'),analyzeRoute:controller.includes('@Post("analyze")'),reasonRoute:controller.includes('@Post("reason")'),recommendRoute:controller.includes('@Post("recommend")'),similarityRoute:controller.includes('@Get("similar/:knowledgeId")'),learningRoute:controller.includes('@Post("learning/signals")'),semanticPipeline:engine.includes("semantic.search"),rankingPipeline:engine.includes("ranking.rank"),confidencePipeline:engine.includes("confidenceService.calculate"),conflictDetection:engine.includes("conflictsService.detect"),gapDetection:engine.includes("gapsService.detect"),insightGeneration:engine.includes("insightsService.generate")};
const failed=Object.entries(checks).filter(([,ok])=>!ok).map(([name])=>name);
if(failed.length) throw new Error(`KF-3 smoke failed: ${failed.join(", ")}`);
console.log(JSON.stringify({success:true,system:"AVOS Knowledge Fabric",pack:"KF-3 Knowledge Intelligence",smokeTest:"passed",checks,checkCount:Object.keys(checks).length,nextPack:"KF-4 Knowledge Governance"},null,2));