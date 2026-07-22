import { Injectable } from '@nestjs/common';
import { MobilityRuntimeService } from './mobility-runtime.service';
@Injectable()
export class VerificationService {
 constructor(private readonly runtime:MobilityRuntimeService){}
 verify(){const s=this.runtime.status();const has=(c:string)=>s.platformConnections.some(x=>x.capability===c&&x.connected);const checks={operational:s.status==='operational',score100:s.score===100,executionConnected:has('execution'),knowledgeConnected:has('knowledge'),intelligenceConnected:has('intelligence'),productionConnected:has('production'),identityConnected:has('identity'),humanFinalAuthority:s.humanFinalAuthority,globalComplianceReadinessGate:s.globalComplianceReadinessGate,mvpProductMode:s.productMode==='mvp'};const passed=Object.values(checks).every(Boolean);return {name:'AVOS Mobility Unified MVP Verification',version:s.version,status:passed?'passed':'failed',score:passed?100:s.score,checks,runtime:s,verifiedAt:new Date().toISOString()};}
}
