import { Injectable } from "@nestjs/common";

@Injectable()
export class ArchitectureRecommendationService{
  recommend(input?:any){
    return {
      success:true,
      service:"ArchitectureRecommendationService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
