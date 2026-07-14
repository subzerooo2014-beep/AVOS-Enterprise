import { Injectable } from "@nestjs/common";

@Injectable()
export class GlobalRuntimeService {
  activate() {
    return {
      regions: ["UAE", "GCC", "Europe", "Asia", "Americas"],
      highAvailability: true,
      multiRegionReady: true,
      disasterRecoveryReady: true,
      runtimeScore: 98,
      status: "ACTIVE",
      activatedAt: new Date().toISOString(),
    };
  }
}