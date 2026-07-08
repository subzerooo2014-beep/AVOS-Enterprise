import { Injectable } from "@nestjs/common";

@Injectable()
export class RiskEngineService{
 analyze(data:any){
   let risk="LOW";
   if((data.amount??0)>250000) risk="MEDIUM";
   if((data.amount??0)>500000) risk="HIGH";

   return{
     risk,
     fraudScore: Math.round(Math.random()*100),
     recommendation:
       risk==="HIGH"
         ?"Manual investigation"
         :"Continue workflow",
   };
 }
}
