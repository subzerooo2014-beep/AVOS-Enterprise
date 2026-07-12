import {
  V5AbsoluteInput,
  V5AbsoluteReadiness,
} from "./contracts";

export class V5AbsoluteReadinessGenerator {
  score(input: V5AbsoluteInput): V5AbsoluteReadiness {
    const genesis = input.capabilityDomains.length > 0 ? 99 : 0;
    const federation = input.federations.length > 0 ? 99 : 0;
    const innovation = input.innovationDomains.length > 0 ? 98 : 0;
    const law = input.lawDomains.length > 0 ? 98 : 0;
    const simulation = input.worlds.length > 0 ? 99 : 0;
    const memory = input.memoryDomains.length > 0 ? 99 : 0;

    return {
      genesis,
      federation,
      innovation,
      law,
      simulation,
      memory,
      total: Math.round(
        (genesis +
          federation +
          innovation +
          law +
          simulation +
          memory) /
          6,
      ),
    };
  }
}
