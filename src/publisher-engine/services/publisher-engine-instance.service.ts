import { Injectable } from "@nestjs/common";
import { PublisherEngineFactoryService } from "./publisher-engine-factory.service";

@Injectable()
export class PublisherEngineInstanceService{

  constructor(
    private readonly factory:PublisherEngineFactoryService,
  ){}

  instance(){
    return this.factory.create();
  }

}
