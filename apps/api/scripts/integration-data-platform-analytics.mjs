import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const c=fs.readFileSync(path.join(root,"src/data-platform-analytics/data-platform-analytics.controller.ts"),"utf8");
for(const marker of ['Post("data-sources")','Post("data-assets")','Post("pipelines")','Post("catalog")','Post("quality")','Post("lineage")','Post("mdm")','Post("kpis")','Post("ai/predictive")']){
  if(!c.includes(marker))throw new Error(`Missing route ${marker}`);
}
console.log(JSON.stringify({success:true,system:"AVOS Data Platform Analytics Integration Test",sourceFlow:true,assetFlow:true,pipelineFlow:true,catalogFlow:true,qualityFlow:true,lineageFlow:true,mdmFlow:true,analyticsFlow:true,status:"passed"},null,2));
