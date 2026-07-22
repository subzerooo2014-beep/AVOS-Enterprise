import { Injectable } from '@nestjs/common';
import { MOBILITY_NAME,MOBILITY_VERSION } from './avos-mobility-unified-mvp.constants';
import { MobilityStoreService } from './mobility-store.service';
import { PlatformIntegrationService } from './platform-integration.service';
@Injectable()
export class MobilityRuntimeService {
 constructor(private readonly store:MobilityStoreService,private readonly platform:PlatformIntegrationService){}
 status(){const connections=this.platform.health();const score=Math.round(connections.filter(x=>x.connected).length/connections.length*100);return {name:MOBILITY_NAME,version:MOBILITY_VERSION,status:score===100?'operational':'degraded',score,productMode:'mvp',foundationFirst:true,capabilityFirst:true,blueprintDriven:true,humanFinalAuthority:true,globalComplianceReadinessGate:true,platformConnections:connections,records:this.store.snapshot(),generatedAt:new Date().toISOString()};}
 health(){const s=this.status();return {state:s.status,score:s.score,integrationsConnected:s.platformConnections.filter(x=>x.connected).length,integrationsRequired:s.platformConnections.length,records:s.records,checkedAt:new Date().toISOString()};}
}
