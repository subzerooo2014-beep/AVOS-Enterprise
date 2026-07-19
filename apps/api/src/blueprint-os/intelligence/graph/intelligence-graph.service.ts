import { Injectable } from "@nestjs/common";

@Injectable()
export class IntelligenceGraphService{
  graph(){
    return {
      success:true,
      service:"IntelligenceGraphService",
      timestamp:new Date().toISOString()
    };
  }
}
