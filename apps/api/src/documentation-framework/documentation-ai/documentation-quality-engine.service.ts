import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  DocumentationAssetInput,
  DocumentationQualityDimension,
  DocumentationQualityReport,
} from "./documentation-ai.types";
import { DocumentationGapDetectorService } from "./documentation-gap-detector.service";

@Injectable()
export class DocumentationQualityEngineService {
  constructor(
    private readonly gapDetector: DocumentationGapDetectorService,
  ) {}

  evaluate(asset: DocumentationAssetInput): DocumentationQualityReport {
    const gaps = this.gapDetector.detect(asset);

    const completeness = Math.min(
      100,
      40 +
        (asset.description ? 15 : 0) +
        (asset.version ? 15 : 0) +
        ((asset.dependencies?.length ?? 0) > 0 ? 15 : 0) +
        (asset.content.length >= 300 ? 15 : 0),
    );

    const clarity = Math.min(
      100,
      55 +
        (asset.content.includes("\n") ? 15 : 0) +
        (asset.content.includes("#") ? 15 : 0) +
        (asset.content.length >= 150 ? 15 : 0),
    );

    const governance = Math.min(
      100,
      50 +
        (asset.owner ? 20 : 0) +
        ((asset.tags?.length ?? 0) > 0 ? 15 : 0) +
        (asset.metadata ? 15 : 0),
    );

    const dimensions: DocumentationQualityDimension[] = [
      {
        name: "completeness",
        score: completeness,
        weight: 45,
        findings:
          completeness < 80 ? ["Documentation completeness is below target."] : [],
        recommendations:
          completeness < 90 ? ["Complete all mandatory documentation fields."] : [],
      },
      {
        name: "clarity",
        score: clarity,
        weight: 35,
        findings: clarity < 80 ? ["Documentation clarity can be improved."] : [],
        recommendations:
          clarity < 90 ? ["Use structured headings, examples, and explicit behavior."] : [],
      },
      {
        name: "governance",
        score: governance,
        weight: 20,
        findings:
          governance < 80 ? ["Governance metadata is incomplete."] : [],
        recommendations:
          governance < 90 ? ["Declare owner, tags, and governance metadata."] : [],
      },
    ];

    const score = Math.round(
      dimensions.reduce(
        (total, item) => total + item.score * item.weight,
        0,
      ) / 100,
    );

    const findings = dimensions.flatMap((item) => item.findings);
    const recommendations = [
      ...dimensions.flatMap((item) => item.recommendations),
      ...gaps.map((gap) => gap.recommendation),
    ];

    return {
      id: `documentation-quality:${randomUUID()}`,
      assetId: asset.id ?? asset.name,
      score,
      status:
        score >= 90
          ? "excellent"
          : score >= 75
            ? "good"
            : score >= 50
              ? "needs-improvement"
              : "critical",
      dimensions,
      gaps,
      findings,
      recommendations: [...new Set(recommendations)],
      generatedAt: new Date().toISOString(),
    };
  }
}