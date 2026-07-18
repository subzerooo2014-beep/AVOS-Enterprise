import fs from "node:fs"; import path from "node:path";
const root=process.cwd();
const files=["src/app/provider-workspace/page.tsx","src/components/provider-workspace/provider-workspace-dashboard.tsx","src/data/provider-workspace.ts","src/store/provider-workspace-store.ts"];
const missing=files.filter((file)=>!fs.existsSync(path.join(root,file)));
const dashboard=fs.readFileSync(path.join(root,"src/components/provider-workspace/provider-workspace-dashboard.tsx"),"utf8");
const checks={requiredFilesPresent:missing.length===0,branchManagementReady:dashboard.includes("providerBranches"),bookingEngineReady:dashboard.includes("visibleBookings"),staffManagementReady:dashboard.includes("providerStaff"),capacityManagementReady:dashboard.includes("capacity-meter"),aiProviderAssistantReady:dashboard.includes("providerAiInsights")};
const success=Object.values(checks).every(Boolean); process.stdout.write(JSON.stringify({success,system:"AVOS Web Platform",megaPack:"Services Platform V2 - Mega Pack 2",version:"2.2.0",classification:"provider-workspace-booking-capacity-layer",requiredFiles:files.length,missing,checks,healthStatus:success?"healthy":"unhealthy"})); if(!success)process.exit(1);
