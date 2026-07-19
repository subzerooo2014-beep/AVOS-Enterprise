import { Injectable } from "@nestjs/common";

@Injectable()
export class CompilationPipelineService {

  execute(input:any){

    return {
      component:"compilation-pipeline",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
