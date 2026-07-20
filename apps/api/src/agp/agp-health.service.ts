import { Injectable } from "@nestjs/common";
import { AgpConstitutionService } from "./agp-constitution.service";
import { AgpMapsService } from "./agp-maps.service";

@Injectable()
export class AgpHealthService {
  constructor(
    private readonly constitution: AgpConstitutionService,
    private readonly maps: AgpMapsService,
  ) {}

  status() {
    const architecture = this.constitution.reviewArchitecture();
    const allMaps = this.maps.all();
    return {
      name: "AVOS Growth Platform (AGP) — Constitutional Mega Pack 0",
      version: "AGP-MP0-1.0.0",
      status: "operational",
      score: 100,
      architectureReview: architecture.status,
      maps: {
        capabilityMap: allMaps.capabilityMap.items.length,
        serviceMap: allMaps.serviceMap.items.length,
        engineMap: allMaps.engineMap.items.length,
        dataMap: allMaps.dataMap.items.length,
        integrationMap: allMaps.integrationMap.items.length,
        roadmap: allMaps.roadmap.items.length,
      },
      principles: architecture.principles,
      generatedAt: new Date().toISOString(),
    };
  }
}