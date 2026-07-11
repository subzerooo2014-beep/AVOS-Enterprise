import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineConfigService{

  config(){

    return{

      version:"2.0.0",
      environment:process.env.NODE_ENV ?? "development",
      maxWorkers:8,
      maxQueue:1000,
      retryLimit:3,

    };

  }

}
