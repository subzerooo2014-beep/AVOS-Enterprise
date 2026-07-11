import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineModuleRegistryService {

  private readonly modules: string[] = [];

  register(name: string) {
    if (!this.modules.includes(name)) {
      this.modules.push(name);
    }
  }

  all() {
    return this.modules;
  }

}
