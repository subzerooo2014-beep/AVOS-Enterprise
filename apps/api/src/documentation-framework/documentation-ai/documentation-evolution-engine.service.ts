import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  DocumentationAssetInput,
  DocumentationEvolutionRecord,
  DocumentationQualityReport,
} from "./documentation-ai.types";

@Injectable()
export class DocumentationEvolutionEngineService {
  evolve(
    asset: DocumentationAssetInput,
    quality: DocumentationQualityReport,
  ): DocumentationEvolutionRecord {
    const fromVersion = asset.version?.trim() || "0.0.0";
    const parts = fromVersion
      .split(".")
      .map((value: string) => Number.parseInt(value, 10) || 0);

    while (parts.length < 3) parts.push(0);

    const changeType =
      quality.score < 50 ? "major" : quality.score < 75 ? "minor" : "patch";

    if (changeType === "major") {
      parts[0] += 1;
      parts[1] = 0;
      parts[2] = 0;
    } else if (changeType === "minor") {
      parts[1] += 1;
      parts[2] = 0;
    } else {
      parts[2] += 1;
    }

    return {
      id: `documentation-evolution:${randomUUID()}`,
      assetId: asset.id ?? asset.name,
      fromVersion,
      toVersion: parts.slice(0, 3).join("."),
      changeType,
      summary: `Documentation evolution planned from quality score ${quality.score}.`,
      changes: [...quality.recommendations],
      qualityBefore: quality.score,
      qualityAfter: Math.min(100, quality.score + 10),
      evolvedAt: new Date().toISOString(),
    };
  }
}