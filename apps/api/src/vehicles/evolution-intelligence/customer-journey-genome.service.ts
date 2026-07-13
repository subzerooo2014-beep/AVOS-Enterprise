import { Injectable } from "@nestjs/common";

@Injectable()
export class CustomerJourneyGenomeService {
  analyze(input: {
    discovery: number;
    engagement: number;
    trust: number;
    conversion: number;
    retention: number;
  }) {
    const genomeScore = Math.round(
      input.discovery * 0.15 +
        input.engagement * 0.2 +
        input.trust * 0.2 +
        input.conversion * 0.25 +
        input.retention * 0.2,
    );

    return {
      genomeScore,
      stage: genomeScore >= 80 ? "LOYAL" : genomeScore >= 60 ? "ACTIVE" : "EARLY",
    };
  }
}
