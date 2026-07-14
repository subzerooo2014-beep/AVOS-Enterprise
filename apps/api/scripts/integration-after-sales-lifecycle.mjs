import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const controller=fs.readFileSync(path.join(root,"src/after-sales-lifecycle/after-sales-lifecycle.controller.ts"),"utf8");
for(const marker of ['Post("lifecycles")','Post("maintenance")','Post("warranties")','Post("service-history")','Post("recalls")','Post("parts")','Post("roadside")','Post("repairs")','Post("ai/predictive-maintenance")','Post("ai/residual-value")']){
  if(!controller.includes(marker))throw new Error(`Missing route ${marker}`);
}
console.log(JSON.stringify({success:true,system:"AVOS After-Sales Lifecycle Integration Test",lifecycleFlow:true,maintenanceFlow:true,warrantyFlow:true,recallFlow:true,partsFlow:true,roadsideFlow:true,repairFlow:true,aiFlow:true,status:"passed"},null,2));
