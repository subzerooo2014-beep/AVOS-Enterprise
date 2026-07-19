import { Injectable } from "@nestjs/common";
import { OmegaAssessment } from "../omega.types";

@Injectable()
export class OmegaHistoryService {
  private readonly assessments: OmegaAssessment[] = [];

  append(assessment: OmegaAssessment): void {
    this.assessments.unshift(assessment);

    if (this.assessments.length > 100) {
      this.assessments.length = 100;
    }
  }

  list(limit = 20): readonly OmegaAssessment[] {
    return this.assessments.slice(0, Math.max(1, Math.min(limit, 100)));
  }

  latest(): OmegaAssessment | null {
    return this.assessments[0] ?? null;
  }

  count(): number {
    return this.assessments.length;
  }
}
