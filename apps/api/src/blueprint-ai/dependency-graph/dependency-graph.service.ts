import { Injectable } from "@nestjs/common";

@Injectable()
export class DependencyGraphService{

  health(){
    return {
      module:"dependency-graph",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
