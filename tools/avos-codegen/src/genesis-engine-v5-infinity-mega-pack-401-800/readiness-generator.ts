import {
  V5InfinityInput,
  V5InfinityReadiness,
} from "./contracts";

export class V5InfinityReadinessGenerator {
  score(input: V5InfinityInput): V5InfinityReadiness {
    const civilization = input.civilizations.length > 0 ? 98 : 0;
    const economy = input.economies.length > 0 ? 97 : 0;
    const science = input.scientificDomains.length > 0 ? 96 : 0;
    const infrastructure =
      input.infrastructureDomains.length > 0 ? 97 : 0;
    const trust =
      input.constitutionalPrinciples.length >= 3 ? 98 : 75;
    const evolution =
      input.enableRecursiveEvolution === false ? 80 : 99;

    return {
      civilization,
      economy,
      science,
      infrastructure,
      trust,
      evolution,
      total: Math.round(
        (civilization +
          economy +
          science +
          infrastructure +
          trust +
          evolution) /
          6,
      ),
    };
  }
}
