import { Injectable } from "@nestjs/common";

@Injectable()
export class CapabilityFabricIntegrationService{
 status(){
   return {
     subsystem:"Capability Fabric",
     connected:true,
     checkedAt:new Date().toISOString()
   };
 }
}
