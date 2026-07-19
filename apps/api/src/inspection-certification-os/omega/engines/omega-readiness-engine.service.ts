import { Injectable } from "@nestjs/common";
import { OmegaScore } from "../omega.types";

@Injectable()
export class OmegaReadinessEngineService {
  classify(score: OmegaScore): {
    readonly level:
      | "not-ready"
      | "development-ready"
      | "release-ready"
      | "production-ready"
      | "enterprise-certified";
    readonly reasons: readonly string[];
  } {
    if (score.quality >= 95 && score.trust >= 95 && score.risk <= 5) {
      return {
        level: "enterprise-certified",
        reasons: ["Exceptional quality, trust, and risk posture."],
      };
    }

    if (score.quality >= 85 && score.trust >= 85 && score.risk <= 20) {
      return {
        level: "production-ready",
        reasons: ["Production thresholds were satisfied."],
      };
    }

    if (score.quality >= 75 && score.risk <= 35) {
      return {
        level: "release-ready",
        reasons: ["Release thresholds were satisfied."],
      };
    }

    if (score.quality >= 60) {
      return {
        level: "development-ready",
        reasons: ["Suitable for continued controlled development."],
      };
    }

    return {
      level: "not-ready",
      reasons: ["Quality or risk thresholds were not satisfied."],
    };
  }
}
