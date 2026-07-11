import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineVersionManagerService{

  current(){

    return{

      version:"2.0.0",
      codename:"Enterprise",
      build:"Production",
      generatedAt:new Date(),

    };

  }

}
