import { Injectable } from "@nestjs/common";
import { PublisherEngineRegistryService } from "./publisher-engine-registry.service";

@Injectable()
export class PublisherEngineLoaderService{

  constructor(
    private readonly registry:PublisherEngineRegistryService,
  ){}

  load(item:any){
    this.registry.register(item);
    return item;
  }

}
