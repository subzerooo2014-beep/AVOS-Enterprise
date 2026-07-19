import { Injectable } from "@nestjs/common";

@Injectable()
export class CompilerCacheService {

  execute(input:any){

    return {
      component:"compiler-cache",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
