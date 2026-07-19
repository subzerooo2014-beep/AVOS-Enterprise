import { Injectable } from "@nestjs/common";

@Injectable()
export class ReasoningEngineService{
  reason(){
    return {
      success:true,
      service:"ReasoningEngineService",
      timestamp:new Date().toISOString()
    };
  }
}
