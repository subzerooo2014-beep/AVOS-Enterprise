import { Injectable } from "@nestjs/common";
import { PublisherEngineResourceService } from "./publisher-engine-resource.service";

@Injectable()
export class PublisherEngineResourceMonitorService {

  constructor(
    private readonly resource: PublisherEngineResourceService,
  ) {}

  monitor() {
    return {
      resources: this.resource.resources(),
      generatedAt: new Date(),
    };
  }

}
