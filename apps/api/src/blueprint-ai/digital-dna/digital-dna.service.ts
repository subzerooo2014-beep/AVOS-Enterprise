import { Injectable } from "@nestjs/common";

@Injectable()
export class DigitalDnaService{

  health(){
    return {
      module:"digital-dna",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
