import { Injectable } from "@nestjs/common";
import {
  DocumentationGap,
  DocumentationQualityReport,
} from "./documentation-ai.types";

@Injectable()
export class DocumentationRecommendationEngineService {
  recommend(
    quality: DocumentationQualityReport,
    gaps: DocumentationGap[] = quality.gaps,
  ): string[] {
    return [
      ...quality.recommendations,
      ...gaps.map((gap) => gap.recommendation),
    ].filter((value, index, values) => values.indexOf(value) === index);
  }
}