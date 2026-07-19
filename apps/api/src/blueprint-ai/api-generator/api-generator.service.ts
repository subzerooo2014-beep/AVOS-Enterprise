import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiGeneratorService{

  health(){
    return {
      module:"api-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
