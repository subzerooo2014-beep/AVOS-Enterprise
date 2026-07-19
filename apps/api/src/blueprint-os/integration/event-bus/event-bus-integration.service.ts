import { Injectable } from "@nestjs/common";

@Injectable()
export class EventBusIntegrationService{
 status(){
   return {
     subsystem:"Event Bus",
     connected:true,
     checkedAt:new Date().toISOString()
   };
 }
}
