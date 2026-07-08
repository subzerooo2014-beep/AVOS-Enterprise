import { Injectable } from "@nestjs/common";

@Injectable()
export class ScoringEngineService{
  score(entity:any){
    return{
      score:95,
      grade:"A",
    };
  }
}
