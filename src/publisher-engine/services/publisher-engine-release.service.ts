import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineReleaseService {

  release(){
    return{
      version:"2.0.0",
      channel:"production",
      releasedAt:new Date(),
    };
  }

}
