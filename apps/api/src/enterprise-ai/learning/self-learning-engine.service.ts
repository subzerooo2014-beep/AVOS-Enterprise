import { Injectable } from "@nestjs/common";

@Injectable()
export class SelfLearningEngineService {
  learn(event:any){
    return {
      learned:true,
      event,
      updatedAt:new Date().toISOString(),
    };
  }
}
