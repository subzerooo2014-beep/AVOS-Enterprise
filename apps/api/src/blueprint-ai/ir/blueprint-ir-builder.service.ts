import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintIrBuilderService {

  build(domain:any){
    return {
      version:"1.0",
      blueprint:{
        entities:domain.aggregates,
        relations:domain.relationships
      }
    };
  }

}
