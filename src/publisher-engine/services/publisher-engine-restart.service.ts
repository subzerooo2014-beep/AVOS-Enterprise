import { Injectable } from "@nestjs/common";
import { PublisherEngineBootService } from "./publisher-engine-boot.service";
import { PublisherEngineShutdownService } from "./publisher-engine-shutdown.service";

@Injectable()
export class PublisherEngineRestartService {
  constructor(
    private readonly boot: PublisherEngineBootService,
    private readonly shutdown: PublisherEngineShutdownService,
  ) {}

  restart() {
    return {
      shutdown: this.shutdown.shutdown(),
      boot: this.boot.boot(),
      restartedAt: new Date(),
    };
  }
}
