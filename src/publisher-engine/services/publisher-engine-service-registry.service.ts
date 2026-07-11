import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineServiceRegistryService {

  private readonly services = new Map<string, any>();

  register(name: string, service: any) {
    this.services.set(name, service);
  }

  resolve(name: string) {
    return this.services.get(name);
  }

  list() {
    return [...this.services.keys()];
  }
}
