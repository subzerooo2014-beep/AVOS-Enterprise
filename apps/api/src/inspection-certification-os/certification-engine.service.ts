import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { ClassificationEngineService } from "./classification-engine.service";
import { InspectionEngineService } from "./inspection-engine.service";
import { ScoreEngineService } from "./score-engine.service";
import { CertificationReport } from "./inspection-certification.types";

@Injectable()
export class CertificationEngineService {
  constructor(
    private readonly inspectionEngine: InspectionEngineService,
    private readonly scoreEngine: ScoreEngineService,
    private readonly classificationEngine: ClassificationEngineService,
  ) {}

  certifyFoundation(): CertificationReport {
    const results = this.inspectionEngine.runFoundationInspection();
    const score = this.scoreEngine.calculate(results);
    const decision = this.classificationEngine.classify(score, results);

    return {
      certificationId: `AVOS-IC-${randomUUID()}`,
      version: "1.1.0",
      status: decision.status,
      classification: decision.classification,
      score,
      requiredFailures: results.filter(
        (result) =>
          result.severity === "required" && result.status === "fail",
      ).length,
      warnings: results.filter((result) => result.status === "warn").length,
      humanFinalAuthority: true,
      generatedAt: new Date().toISOString(),
      results,
    };
  }
}
