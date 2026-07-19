import { Injectable } from "@nestjs/common";

@Injectable()
export class DtoGeneratorService{

  health(){
    return {
      module:"dto-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
