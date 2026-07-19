import { Injectable } from "@nestjs/common";

@Injectable()
export class SymbolTableService {

  execute(input:any){

    return {
      component:"symbol-table",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
