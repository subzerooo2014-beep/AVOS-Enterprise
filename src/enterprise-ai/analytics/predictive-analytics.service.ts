import { Injectable } from "@nestjs/common";

@Injectable()
export class PredictiveAnalyticsService{
 analyze(data:any){
   return{
     trend:"UP",
     confidence:93,
   };
 }
}
