import { Injectable } from "@nestjs/common";

@Injectable()
export class ValidationService{

  health(){
    return {
      module:"validation",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
