import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintCompilerService {

  execute(input:any){

    return {
      component:"blueprint-compiler",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
