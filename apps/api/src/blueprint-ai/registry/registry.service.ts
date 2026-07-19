import { Injectable } from "@nestjs/common";

@Injectable()
export class RegistryService{

  health(){
    return {
      module:"registry",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
