import { Injectable } from "@nestjs/common";

@Injectable()
export class IntermediateRepresentationService {

  execute(input:any){

    return {
      component:"intermediate-representation",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
