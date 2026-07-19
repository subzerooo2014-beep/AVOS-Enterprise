import { Injectable } from "@nestjs/common";

@Injectable()
export class ErrorReporterService {

  execute(input:any){

    return {
      component:"error-reporter",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
