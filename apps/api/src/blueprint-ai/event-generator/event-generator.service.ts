import { Injectable } from "@nestjs/common";

@Injectable()
export class EventGeneratorService{

  health(){
    return {
      module:"event-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
