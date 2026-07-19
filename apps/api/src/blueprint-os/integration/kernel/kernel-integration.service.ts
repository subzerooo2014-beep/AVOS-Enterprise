import { Injectable } from "@nestjs/common";

@Injectable()
export class KernelIntegrationService{
 status(){
   return {
     subsystem:"Enterprise Kernel",
     connected:true,
     checkedAt:new Date().toISOString()
   };
 }
}
