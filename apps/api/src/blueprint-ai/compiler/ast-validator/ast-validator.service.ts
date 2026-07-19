import { Injectable } from "@nestjs/common";

@Injectable()
export class AstValidatorService {

  execute(input:any){

    return {
      component:"ast-validator",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
