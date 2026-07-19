import { Injectable } from "@nestjs/common";

@Injectable()
export class FoundationIntegrationService{
 status(){
   return {
     subsystem:"Foundation",
     connected:true,
     checkedAt:new Date().toISOString()
   };
 }
}
