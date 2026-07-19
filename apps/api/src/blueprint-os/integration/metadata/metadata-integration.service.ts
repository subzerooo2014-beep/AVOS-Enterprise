import { Injectable } from "@nestjs/common";

@Injectable()
export class MetadataIntegrationService{
 status(){
   return {
     subsystem:"Metadata",
     connected:true,
     checkedAt:new Date().toISOString()
   };
 }
}
