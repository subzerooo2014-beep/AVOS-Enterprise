import { Injectable } from "@nestjs/common";
import { PublisherEngineEventRegistryService } from "./publisher-engine-event-registry.service";

@Injectable()
export class PublisherEngineEventMonitorService{

  constructor(
    private readonly registry:PublisherEngineEventRegistryService,
  ){}

  monitor(){
    return{
      total:this.registry.latest(10000).length,
      latest:this.registry.latest(20),
      generatedAt:new Date(),
    };
  }

}
