import { Injectable } from "@nestjs/common";
import {
  TrustScoreRecord,
  TrustSubjectType
} from "../foundation-pack-4.types";

@Injectable()
export class TrustScoreEngineService {
  private readonly scores = new Map<string, TrustScoreRecord>();

  list() {
    return Array.from(this.scores.values());
  }

  calculate(input: {
    subjectId: string;
    subjectType: TrustSubjectType;
    reliability: number;
    transparency: number;
    provenanceQuality: number;
    compliance: number;
    humanOversight: number;
    reasons?: string[];
  }) {
    const dimensions = {
      reliability: this.clamp(input.reliability),
      transparency: this.clamp(input.transparency),
      provenanceQuality: this.clamp(input.provenanceQuality),
      compliance: this.clamp(input.compliance),
      humanOversight: this.clamp(input.humanOversight)
    };

    const score = Number(
      (
        dimensions.reliability * 0.25 +
        dimensions.transparency * 0.2 +
        dimensions.provenanceQuality * 0.2 +
        dimensions.compliance * 0.2 +
        dimensions.humanOversight * 0.15
      ).toFixed(2)
    );

    const id = `trust-score:${input.subjectType}:${input.subjectId}`;

    const record: TrustScoreRecord = {
      id,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      score,
      ...dimensions,
      reasons: Array.from(new Set(input.reasons ?? [])),
      calculatedAt: new Date().toISOString()
    };

    this.scores.set(id, record);
    return record;
  }

  getBySubject(subjectId: string) {
    return this.list().filter((record) => record.subjectId === subjectId);
  }

  summary() {
    const scores = this.list();

    return {
      total: scores.length,
      averageScore:
        scores.length === 0
          ? 0
          : Number(
              (
                scores.reduce((sum, record) => sum + record.score, 0) /
                scores.length
              ).toFixed(2)
            ),
      trusted: scores.filter((record) => record.score >= 80).length,
      reviewRequired: scores.filter((record) => record.score < 60).length
    };
  }

  private clamp(value: number) {
    return Math.max(0, Math.min(100, value));
  }
}
