import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeFabricIntegrationService{
 status(){
   return {
     subsystem:"Knowledge Fabric",
     connected:true,
     checkedAt:new Date().toISOString()
   };
 }
}
