import { Injectable } from "@nestjs/common";

@Injectable()
export class IrOptimizerService {

  execute(input:any){

    return {
      component:"ir-optimizer",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
