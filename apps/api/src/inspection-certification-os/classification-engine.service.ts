import { Injectable } from "@nestjs/common";
import {
  CertificationClassification,
  CertificationScore,
  InspectionResult,
} from "./inspection-certification.types";

@Injectable()
export class ClassificationEngineService {
  classify(
    score: CertificationScore,
    results: readonly InspectionResult[],
  ): {
    classification: CertificationClassification;
    status:
      | "certified"
      | "certified-with-observations"
      | "conditional"
      | "failed";
  } {
    const requiredFailure = results.some(
      (result) => result.severity === "required" && result.status === "fail",
    );

    if (requiredFailure) {
      return { classification: "not-certified", status: "failed" };
    }

    if (score.score >= 95) {
      return { classification: "enterprise-certified", status: "certified" };
    }

    if (score.score >= 90) {
      return {
        classification: "production-ready",
        status: "certified-with-observations",
      };
    }

    if (score.score >= 80) {
      return { classification: "conditional", status: "conditional" };
    }

    return { classification: "not-certified", status: "failed" };
  }
}
