import { Injectable } from "@nestjs/common";

@Injectable()
export class DependencyGraphIntegrationService{
 status(){
   return {
     subsystem:"Dependency Graph",
     connected:true,
     checkedAt:new Date().toISOString()
   };
 }
}
