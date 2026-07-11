import { Injectable } from "@nestjs/common";
import { PublisherEngineUuidService } from "./publisher-engine-uuid.service";
import { PublisherEngineClockService } from "./publisher-engine-clock.service";

@Injectable()
export class PublisherEngineFactoryService{

  constructor(
    private readonly uuid:PublisherEngineUuidService,
    private readonly clock:PublisherEngineClockService,
  ){}

  create(){

    return{

      id:this.uuid.create(),
      createdAt:this.clock.now(),

    };

  }

}
