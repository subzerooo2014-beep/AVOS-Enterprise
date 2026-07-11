import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class PublisherBootstrapService implements OnModuleInit {
  async onModuleInit() {
    console.log("[PublisherEngineV2] Ready");
  }
}
