import { Injectable } from "@nestjs/common";

@Injectable()
export class AstBuilderService {

  execute(input:any){

    return {
      component:"ast-builder",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
