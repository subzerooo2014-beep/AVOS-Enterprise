import { Injectable } from "@nestjs/common";

@Injectable()
export class PlatformEvolutionIndexService {
  calculate() {
    const architecture = 94;
    const intelligence = 92;
    const automation = 90;
    const ecosystem = 86;
    const valueCreation = 93;
    const overall = Math.round((architecture + intelligence + automation + ecosystem + valueCreation) / 5);

    return {
      architecture,
      intelligence,
      automation,
      ecosystem,
      valueCreation,
      overall,
      generatedAt: new Date().toISOString(),
    };
  }
}