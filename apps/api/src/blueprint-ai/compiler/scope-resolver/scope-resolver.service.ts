import { Injectable } from "@nestjs/common";

@Injectable()
export class ScopeResolverService {

  execute(input:any){

    return {
      component:"scope-resolver",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
