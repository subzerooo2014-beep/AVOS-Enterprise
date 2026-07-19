import { Injectable } from "@nestjs/common";

@Injectable()
export class ImpactPredictionService{
  predict(){
    return {
      success:true,
      service:"ImpactPredictionService",
      timestamp:new Date().toISOString()
    };
  }
}
