import { Injectable } from "@nestjs/common";

@Injectable()
export class RecommendationEngineService{
 recommend(vehicle:any){
   return {
     recommendations:[
       "Similar vehicles",
       "Cross-sell warranty",
       "Offer financing",
       "Promote premium package"
     ],
     vehicle,
   };
 }
}
