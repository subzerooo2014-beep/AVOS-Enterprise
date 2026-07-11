import { Injectable } from "@nestjs/common";
import { PublisherEngineComponentService } from "./publisher-engine-component.service";

@Injectable()
export class PublisherEngineComponentLoaderService {

  constructor(
    private readonly component: PublisherEngineComponentService,
  ) {}

  load(name: string) {
    return this.component.component(name);
  }

}
