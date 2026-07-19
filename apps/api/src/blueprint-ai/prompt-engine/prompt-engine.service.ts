import { Injectable } from "@nestjs/common";

@Injectable()
export class PromptEngineService{

  health(){
    return {
      module:"prompt-engine",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
