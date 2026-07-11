import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutiveCopilotService{

 assist(input:any){

   return{
      summary:"Executive recommendation generated.",
      priority:"HIGH",
      actions:[
         "Review KPIs",
         "Monitor sales",
         "Optimize inventory"
      ]
   };

 }

}
