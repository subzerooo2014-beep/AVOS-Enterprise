import { Injectable } from "@nestjs/common";

@Injectable()
export class RecommendationRankingService{
  recommend(vehicle:any){
    return{
      vehicle,
      recommendations:[],
      score:98,
    };
  }
}
