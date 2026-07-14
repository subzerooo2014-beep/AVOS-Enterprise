import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicMarketplaceComposerV2Service {
  compose() {
    return {
      segments: [
        "buyers",
        "sellers",
        "dealers",
        "exporters",
        "fleet-owners",
      ],
      services: [
        "vehicle-marketplace",
        "auction",
        "finance",
        "insurance",
        "inspection",
        "shipping",
        "workshops",
      ],
      marketplaceScore: 96,
      generatedAt: new Date().toISOString(),
    };
  }
}