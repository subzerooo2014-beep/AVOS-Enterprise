import { Injectable } from "@nestjs/common";
import { PublisherRegistryService } from "../publisher-registry.service";
import { PublisherMetricsService } from "./publisher-metrics.service";

@Injectable()
export class PublisherHealthService {
  constructor(
    private readonly registry: PublisherRegistryService,
    private readonly metrics: PublisherMetricsService,
  ) {}

  async health() {
    const channels = [];

    for (const channel of this.registry.list()) {
      const adapter = this.registry.get(channel);
      channels.push({ channel, status: await adapter.health() });
    }

    return {
      success: true,
      version: "v2",
      channels,
      metrics: await this.metrics.summary(),
    };
  }
}
