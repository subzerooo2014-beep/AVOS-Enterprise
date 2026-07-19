import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  DocumentationAssetInput,
  DocumentationGap,
  DocumentationSeverity,
} from "./documentation-ai.types";

@Injectable()
export class DocumentationGapDetectorService {
  detect(asset: DocumentationAssetInput): DocumentationGap[] {
    const gaps: DocumentationGap[] = [];

    const add = (
      code: string,
      title: string,
      description: string,
      severity: DocumentationSeverity,
      recommendation: string,
    ) => {
      gaps.push({
        id: `documentation-gap:${randomUUID()}`,
        code,
        title,
        description,
        severity,
        category: "documentation-quality",
        recommendation,
        detectedAt: new Date().toISOString(),
        resolved: false,
      });
    };

    if (asset.content.trim().length < 120) {
      add(
        "CONTENT_TOO_SHORT",
        "Documentation content is too short",
        "The asset does not contain enough material for reliable documentation.",
        "high",
        "Add purpose, behavior, inputs, outputs, dependencies, and examples.",
      );
    }

    if (!asset.description?.trim()) {
      add(
        "MISSING_DESCRIPTION",
        "Missing description",
        "The documentation asset has no explicit description.",
        "medium",
        "Add a concise description of purpose and scope.",
      );
    }

    if (!asset.version?.trim()) {
      add(
        "MISSING_VERSION",
        "Missing version",
        "The documentation asset does not identify its version.",
        "medium",
        "Add a semantic version.",
      );
    }

    if ((asset.dependencies?.length ?? 0) === 0) {
      add(
        "MISSING_DEPENDENCIES",
        "Dependencies are not declared",
        "The documentation asset has no dependency declaration.",
        "low",
        "Declare dependencies or explicitly state that there are none.",
      );
    }

    return gaps;
  }
}