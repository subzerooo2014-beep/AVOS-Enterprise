import { Injectable } from "@nestjs/common";

@Injectable()
export class OrchestratorService{

  health(){
    return {
      module:"orchestrator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
