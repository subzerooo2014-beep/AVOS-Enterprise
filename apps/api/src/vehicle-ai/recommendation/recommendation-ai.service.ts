import { Injectable } from "@nestjs/common";

@Injectable()
export class RecommendationAiService{
 recommend(vehicle:any){
  return{
   recommendations:[
    "Related vehicles",
    "Similar price range",
    "Upgrade package",
    "Finance offer"
   ]
  };
 }
}
