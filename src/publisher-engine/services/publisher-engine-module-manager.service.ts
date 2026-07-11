import { Injectable } from "@nestjs/common";
import { PublisherEngineModuleLoaderService } from "./publisher-engine-module-loader.service";
import { PublisherEngineModuleRegistryService } from "./publisher-engine-module-registry.service";

@Injectable()
export class PublisherEngineModuleManagerService {

  constructor(
    private readonly loader: PublisherEngineModuleLoaderService,
    private readonly registry: PublisherEngineModuleRegistryService,
  ) {}

  load(name: string) {
    this.registry.register(name);
    return this.loader.load(name);
  }

}
