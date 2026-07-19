import { Injectable } from "@nestjs/common";

@Injectable()
export class DependencyGraphBuilderService {

  execute(input:any){

    return {
      component:"dependency-graph-builder",
      phase:"compiler",
      status:"ready",
      input,
      executedAt:new Date().toISOString()
    };

  }

}
