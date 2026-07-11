import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PublisherEngineBootstrapService implements OnModuleInit {
  onModuleInit() {
    console.log("[PublisherEngine] Bootstrap completed.");
  }
}
