import { Injectable } from "@nestjs/common";
import { PublisherRegistryService } from "../publisher-registry.service";

@Injectable()
export class PublisherHealthMonitorService {
  constructor(
    private readonly registry: PublisherRegistryService,
  ) {}

  async status() {
    const output = [];

    for (const channel of this.registry.list()) {
      const adapter = this.registry.get(channel);

      output.push({
        channel,
        status: await adapter.health(),
      });
    }

    return {
      success: true,
      engine: "PublisherEngineV2",
      channels: output,
      checkedAt: new Date(),
    };
  }
}
