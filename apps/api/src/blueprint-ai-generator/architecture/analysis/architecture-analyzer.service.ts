import { Injectable } from "@nestjs/common";

@Injectable()
export class ArchitectureAnalyzerService{
  analyze(input?:any){
    return {
      success:true,
      service:"ArchitectureAnalyzerService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
