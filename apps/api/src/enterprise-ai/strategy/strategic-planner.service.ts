import { Injectable } from "@nestjs/common";

@Injectable()
export class StrategicPlannerService {
  plan(goal:string){
    return {
      goal,
      phases:["Analyze","Prioritize","Execute","Measure"],
      horizon:"90_DAYS",
    };
  }
}
