import { Injectable } from "@nestjs/common";

@Injectable()
export class ArchitectureAnalyzerService{
  run(){
    return {
      success:true,
      service:"ArchitectureAnalyzerService",
      timestamp:new Date().toISOString()
    };
  }
}
