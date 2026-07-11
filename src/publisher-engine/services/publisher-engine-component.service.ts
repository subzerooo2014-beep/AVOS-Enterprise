import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineComponentService {

  component(name: string) {
    return {
      name,
      enabled: true,
      loadedAt: new Date(),
    };
  }

}
