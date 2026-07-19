import { Injectable } from "@nestjs/common";

@Injectable()
export class DigitalDNAIntegrationService{
 status(){
   return {
     subsystem:"Digital DNA",
     connected:true,
     checkedAt:new Date().toISOString()
   };
 }
}
