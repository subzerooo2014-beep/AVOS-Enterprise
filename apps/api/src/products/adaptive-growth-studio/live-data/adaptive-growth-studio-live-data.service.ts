import { Injectable } from "@nestjs/common";
import { AgsLiveIntelligence } from "./adaptive-growth-studio-live-data.contracts";
import { AdaptiveGrowthStudioLiveDataGateway } from "./adaptive-growth-studio-live-data.gateway";
import { AdaptiveGrowthStudioLiveDataNormalizer } from "./adaptive-growth-studio-live-data.normalizer";

@Injectable()
export class AdaptiveGrowthStudioLiveDataService {
  private cache:
    | {
        expiresAt: number;
        value: AgsLiveIntelligence;
      }
    | undefined;

  constructor(
    private readonly gateway:
      AdaptiveGrowthStudioLiveDataGateway,
    private readonly normalizer:
      AdaptiveGrowthStudioLiveDataNormalizer,
  ) {}

  async snapshot(
    options?: {
      force?: boolean;
    },
  ): Promise<AgsLiveIntelligence> {
    const now = Date.now();

    if (
      !options?.force &&
      this.cache &&
      this.cache.expiresAt > now
    ) {
      return this.cache.value;
    }

    const sources = await this.gateway.collectAll();
    const value = this.normalizer.normalize(sources);

    this.cache = {
      expiresAt: now + 15_000,
      value,
    };

    return value;
  }

  async health() {
    const snapshot = await this.snapshot();

    return {
      name:
        "AVOS Adaptive Growth Studio Live Data Integration",
      version: "AGS-LIVE-1.0.1",
      status: snapshot.status,
      sourceCount: snapshot.sources.length,
      operationalSources: snapshot.sources.filter(
        (item) => item.status === "operational",
      ).length,
      degradedSources: snapshot.sources.filter(
        (item) => item.status === "degraded",
      ).length,
      unavailableSources: snapshot.sources.filter(
        (item) => item.status === "unavailable",
      ).length,
      humanFinalAuthority:
        snapshot.humanFinalAuthority,
      generatedAt:
        snapshot.freshness.generatedAt,
    };
  }
}