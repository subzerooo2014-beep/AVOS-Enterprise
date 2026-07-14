import { Injectable } from "@nestjs/common";

@Injectable()
export class PlatformEvolutionIndexV2Service {
  calculate() {
    const architecture = 96;
    const intelligence = 95;
    const automation = 94;
    const ecosystem = 93;
    const monetization = 92;
    const overall = Math.round(
      (architecture + intelligence + automation + ecosystem + monetization) / 5,
    );

    return {
      architecture,
      intelligence,
      automation,
      ecosystem,
      monetization,
      overall,
      generatedAt: new Date().toISOString(),
    };
  }
}