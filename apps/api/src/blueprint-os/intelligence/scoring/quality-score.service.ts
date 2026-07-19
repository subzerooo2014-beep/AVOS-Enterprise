import { Injectable } from "@nestjs/common";

@Injectable()
export class QualityScoreService{
  score(){
    return {
      success:true,
      service:"QualityScoreService",
      timestamp:new Date().toISOString()
    };
  }
}
