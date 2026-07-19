import { Injectable } from "@nestjs/common";

@Injectable()
export class IncrementalCompilerService {

  execute(input:any){

    return {
      component:"incremental-compiler",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
