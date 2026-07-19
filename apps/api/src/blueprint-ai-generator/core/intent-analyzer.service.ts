import { Injectable } from "@nestjs/common";

@Injectable()
export class IntentAnalyzerService{
  analyze(input?:any){
    return {
      success:true,
      service:"IntentAnalyzerService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
