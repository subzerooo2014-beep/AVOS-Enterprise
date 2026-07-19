import { Injectable } from "@nestjs/common";

@Injectable()
export class QualityEngineService{
  score(input?:any){
    return {
      success:true,
      service:"QualityEngineService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
