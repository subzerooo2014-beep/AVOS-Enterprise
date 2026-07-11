import { Injectable } from "@nestjs/common";
import { PublisherEngineProcessService } from "./publisher-engine-process.service";
import { PublisherEngineStateManagerService } from "./publisher-engine-state-manager.service";

@Injectable()
export class PublisherEngineRuntimeManagerService{

  constructor(
    private readonly process:PublisherEngineProcessService,
    private readonly state:PublisherEngineStateManagerService,
  ){}

  runtime(){
    return{
      state:this.state.get(),
      process:this.process.info(),
      generatedAt:new Date(),
    };
  }

}
