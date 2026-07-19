import { Injectable } from "@nestjs/common";

@Injectable()
export class TypeResolverService {

  execute(input:any){

    return {
      component:"type-resolver",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
