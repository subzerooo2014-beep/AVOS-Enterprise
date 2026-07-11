import { Injectable } from "@nestjs/common";
import { PublisherRegistryService } from "../publisher-registry.service";
import { PublisherContextBuilderService } from "./publisher-context-builder.service";

@Injectable()
export class PublisherSimulationService {
  constructor(
    private readonly registry: PublisherRegistryService,
    private readonly contextBuilder: PublisherContextBuilderService,
  ) {}

  async simulate(input: any) {
    const job = {
      id: input.id ?? "simulation",
      title: input.title ?? "Simulation Publish",
      content: input.content ?? null,
      campaignId: input.campaignId ?? null,
      channelId: input.channelId ?? null,
      retryCount: 0,
      result: input.result ?? { channel: input.channel ?? "internal" },
    };

    const ctx = this.contextBuilder.build(job);
    const adapter = this.registry.get(ctx.channel);

    return {
      success: true,
      simulation: true,
      channelExists: this.registry.exists(ctx.channel),
      health: await adapter.health(),
      context: ctx,
      estimatedResult: {
        status: "published",
        channel: ctx.channel,
        externalId: `SIM-${ctx.channel}-${ctx.jobId}`,
        message: "Simulation only. No external publish executed.",
      },
    };
  }
}
