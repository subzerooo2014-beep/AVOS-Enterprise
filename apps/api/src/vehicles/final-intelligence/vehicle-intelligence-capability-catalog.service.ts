import { Injectable } from "@nestjs/common";

@Injectable()
export class VehicleIntelligenceCapabilityCatalogService {
  list() {
    return {
      totalCapabilities: 100,
      groups: [
        "enterprise-intelligence",
        "ultra-intelligence",
        "autonomous-intelligence",
        "evolution-intelligence",
        "strategic-intelligence",
        "platform-integration",
        "final-intelligence",
      ],
      release: "v100.0.0",
    };
  }
}
