import { Injectable } from "@nestjs/common";
import {
  AvosFactoryQualityScore
} from "./avos-factory-intelligence.contracts";

@Injectable()
export class AvosFactoryQualityScoringService {
  calculate(input: {
    architecture?: number;
    maintainability?: number;
    scalability?: number;
    security?: number;
    documentation?: number;
    reliability?: number;
    reuse?: number;
  }): AvosFactoryQualityScore {
    const normalize = (value: number | undefined): number =>
      Math.max(0, Math.min(100, Math.round(value ?? 75)));

    const architecture = normalize(input.architecture);
    const maintainability = normalize(input.maintainability);
    const scalability = normalize(input.scalability);
    const security = normalize(input.security);
    const documentation = normalize(input.documentation);
    const reliability = normalize(input.reliability);
    const reuse = normalize(input.reuse);

    const overall = Math.round(
      architecture * 0.2 +
      maintainability * 0.15 +
      scalability * 0.15 +
      security * 0.15 +
      documentation * 0.1 +
      reliability * 0.15 +
      reuse * 0.1
    );

    return {
      architecture,
      maintainability,
      scalability,
      security,
      documentation,
      reliability,
      reuse,
      overall,
      calculatedAt: new Date().toISOString()
    };
  }
}
