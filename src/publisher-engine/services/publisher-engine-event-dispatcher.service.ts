import { Injectable } from "@nestjs/common";
import { PublisherEngineEventFactoryService } from "./publisher-engine-event-factory.service";
import { PublisherEngineEventRegistryService } from "./publisher-engine-event-registry.service";

@Injectable()
export class PublisherEngineEventDispatcherService{

  constructor(
    private readonly factory:PublisherEngineEventFactoryService,
    private readonly registry:PublisherEngineEventRegistryService,
  ){}

  dispatch(type:string,payload:any){

    const event=this.factory.create(type,payload);

    return this.registry.publish(event);

  }

}
