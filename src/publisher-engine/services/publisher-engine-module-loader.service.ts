import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineModuleLoaderService {

  load(moduleName: string) {
    return {
      module: moduleName,
      loaded: true,
      timestamp: new Date(),
    };
  }

}
