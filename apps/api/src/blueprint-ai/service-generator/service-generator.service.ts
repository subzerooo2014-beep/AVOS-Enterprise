import { Injectable } from "@nestjs/common";

@Injectable()
export class ServiceGeneratorService{

  health(){
    return {
      module:"service-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
