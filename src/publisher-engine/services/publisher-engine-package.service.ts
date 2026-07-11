import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEnginePackageService {
  package() {
    return {
      name: "publisher-engine",
      version: "2.0.0",
      pack: "production-routing",
      generatedAt: new Date(),
    };
  }
}
