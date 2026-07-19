import { Injectable } from "@nestjs/common";

@Injectable()
export class DomainModelEngineService {

  build(semantic:any){
    return {
      aggregates: semantic.entities ?? [],
      relationships: [],
      valueObjects: []
    };
  }

}
