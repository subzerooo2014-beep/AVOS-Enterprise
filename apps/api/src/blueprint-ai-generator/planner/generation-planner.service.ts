import { Injectable } from "@nestjs/common";

@Injectable()
export class GenerationPlannerService{
  plan(input?:any){
    return {
      success:true,
      component:"GenerationPlannerService",
      generatedAt:new Date().toISOString(),
      input
    };
  }
}
