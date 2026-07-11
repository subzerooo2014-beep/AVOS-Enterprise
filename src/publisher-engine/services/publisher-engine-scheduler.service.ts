import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherEngineSchedulerService {

  private enabled = true;

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  status() {
    return {
      enabled: this.enabled,
      generatedAt: new Date(),
    };
  }
}
