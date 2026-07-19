import { Injectable } from "@nestjs/common";

@Injectable()
export class CompilerRegistryService {

  execute(input:any){

    return {
      component:"compiler-registry",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
