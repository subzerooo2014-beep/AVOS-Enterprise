import { Injectable } from "@nestjs/common";

@Injectable()
export class FinanceAiService{
 forecast(data:any){
   return{
     expectedRevenue:0,
     expectedProfit:0,
     confidence:91,
   };
 }
}
