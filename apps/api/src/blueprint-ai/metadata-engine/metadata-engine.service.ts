import { Injectable } from "@nestjs/common";

@Injectable()
export class MetadataEngineService{

  health(){
    return {
      module:"metadata-engine",
      status:"healthy",
      version:"1.0.0"
    };
  }

}
