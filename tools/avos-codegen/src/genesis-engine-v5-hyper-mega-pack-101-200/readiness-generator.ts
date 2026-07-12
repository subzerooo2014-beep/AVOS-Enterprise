import {
  V5FutureReadinessResult,
  V5HyperEnterpriseInput,
} from "./contracts";

export class V5FutureReadinessGenerator {
  score(input: V5HyperEnterpriseInput): V5FutureReadinessResult {
    const architecture = input.regions.length > 1 ? 96 : 80;
    const economy = input.enableAutonomousEconomy === false ? 75 : 94;
    const knowledge = input.knowledgeDomains.length >= 3 ? 97 : 82;
    const trust = input.trustPrinciples.length >= 3 ? 96 : 78;
    const innovation = input.annualInnovationBudget > 0 ? 95 : 60;
    const total = Math.round(
      (architecture + economy + knowledge + trust + innovation) / 5,
    );

    return {
      architecture,
      economy,
      knowledge,
      trust,
      innovation,
      total,
    };
  }
}
