import { Injectable } from "@nestjs/common";

@Injectable()
export class SalesAiService{
 predict(deal:any){
   return{
     probability:87,
     recommendation:"Close this week",
   };
 }
}
