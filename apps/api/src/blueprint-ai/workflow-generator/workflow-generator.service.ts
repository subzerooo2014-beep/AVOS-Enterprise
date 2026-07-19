import { Injectable } from "@nestjs/common";

@Injectable()
export class WorkflowGeneratorService{

  health(){
    return {
      module:"workflow-generator",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
