import { Injectable } from "@nestjs/common";

@Injectable()
export class CapabilityMapperService{

  health(){
    return {
      module:"capability-mapper",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
