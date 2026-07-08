import { Injectable } from "@nestjs/common";

@Injectable()
export class PredictiveEngineService{
  predict(data:any){
    return{
      nextWeek:{},
      nextMonth:{},
      nextQuarter:{},
      confidence:94,
    };
  }
}
