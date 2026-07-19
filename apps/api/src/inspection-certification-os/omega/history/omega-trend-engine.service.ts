import { Injectable } from "@nestjs/common";
import { OmegaAssessment } from "../omega.types";

@Injectable()
export class OmegaTrendEngineService {
  analyze(history: readonly OmegaAssessment[]) {
    if (history.length === 0) {
      return {
        direction: "stable",
        samples: 0,
        qualityDelta: 0,
        riskDelta: 0,
      };
    }

    const newest = history[0];
    const oldest = history[history.length - 1];

    const qualityDelta = newest.score.quality - oldest.score.quality;
    const riskDelta = newest.score.risk - oldest.score.risk;

    return {
      direction:
        qualityDelta > 0 && riskDelta <= 0
          ? "improving"
          : qualityDelta < 0 || riskDelta > 0
            ? "degrading"
            : "stable",
      samples: history.length,
      qualityDelta: Number(qualityDelta.toFixed(2)),
      riskDelta: Number(riskDelta.toFixed(2)),
    };
  }
}
