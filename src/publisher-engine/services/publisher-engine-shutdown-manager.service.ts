import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineShutdownManagerService{

  shutdown(){

    return{

      success:true,
      state:"SHUTDOWN",
      stoppedAt:new Date(),

    };

  }

}
