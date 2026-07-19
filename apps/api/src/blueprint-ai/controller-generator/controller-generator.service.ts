import { Injectable } from "@nestjs/common";

@Injectable()
export class ControllerGeneratorService{

  health(){
    return {
      module:"controller-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
