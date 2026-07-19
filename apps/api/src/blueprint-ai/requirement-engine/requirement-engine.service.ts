import { Injectable } from "@nestjs/common";

@Injectable()
export class RequirementEngineService{

  health(){
    return {
      module:"requirement-engine",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
