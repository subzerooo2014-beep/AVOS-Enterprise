import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutiveDashboardAiService{
 summary(){
   return{
     salesHealth:"GOOD",
     inventoryHealth:"GOOD",
     financeHealth:"GOOD",
     aiStatus:"ONLINE",
   };
 }
}
