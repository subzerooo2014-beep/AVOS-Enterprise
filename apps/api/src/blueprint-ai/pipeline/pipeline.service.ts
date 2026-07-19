import { Injectable } from "@nestjs/common";

@Injectable()
export class PipelineService{

  health(){
    return {
      module:"pipeline",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
