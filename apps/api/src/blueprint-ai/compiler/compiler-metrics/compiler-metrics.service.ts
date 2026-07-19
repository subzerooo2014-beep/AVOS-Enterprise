import { Injectable } from "@nestjs/common";

@Injectable()
export class CompilerMetricsService {

  execute(input:any){

    return {
      component:"compiler-metrics",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
