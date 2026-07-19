import { Injectable } from "@nestjs/common";

@Injectable()
export class DocumentationGeneratorService{

  health(){
    return {
      module:"documentation-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
