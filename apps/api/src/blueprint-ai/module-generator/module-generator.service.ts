import { Injectable } from "@nestjs/common";

@Injectable()
export class ModuleGeneratorService{

  health(){
    return {
      module:"module-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
