import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineStartupService{

  startup(){

    return{

      success:true,
      state:"STARTED",
      startedAt:new Date(),

    };

  }

}
