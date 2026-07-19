import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  DocumentationAssetInput,
  DocumentationImpactResult,
} from "./documentation-ai.types";

@Injectable()
export class DocumentationImpactAnalysisService {
  analyze(asset: DocumentationAssetInput): DocumentationImpactResult {
    const dependencies = asset.dependencies ?? [];
    const score = Math.min(100, dependencies.length * 12 + 20);

    return {
      id: `documentation-impact:${randomUUID()}`,
      assetId: asset.id ?? asset.name,
      impactedAssets: dependencies,
      impactedCapabilities:
        asset.type === "capability" ? [asset.name] : [],
      impactedModules:
        asset.type === "module" ? [asset.name] : [],
      riskLevel:
        score >= 75 ? "critical" : score >= 50 ? "high" : score >= 25 ? "medium" : "low",
      score,
      findings:
        dependencies.length > 0
          ? [`${dependencies.length} declared dependencies may be affected.`]
          : ["No declared dependency impact."],
      recommendations:
        dependencies.length > 0
          ? ["Review dependent assets before publishing documentation changes."]
          : ["Maintain explicit dependency declarations."],
      analyzedAt: new Date().toISOString(),
    };
  }
}