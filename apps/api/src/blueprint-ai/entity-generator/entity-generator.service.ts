import { Injectable } from "@nestjs/common";

@Injectable()
export class EntityGeneratorService{

  health(){
    return {
      module:"entity-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
