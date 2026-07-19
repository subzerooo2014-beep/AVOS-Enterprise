import { Injectable } from "@nestjs/common";

@Injectable()
export class TestGeneratorService{

  health(){
    return {
      module:"test-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
