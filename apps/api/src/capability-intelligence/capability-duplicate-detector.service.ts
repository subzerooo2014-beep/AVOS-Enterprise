import { Injectable } from "@nestjs/common";
import { CapabilityRegistryService } from "../capability-fabric/capability-registry.service";
import {
  CAPABILITY_INTELLIGENCE_THRESHOLDS,
} from "./capability-intelligence.registry";
import { CapabilityDuplicateMatch } from "./capability-intelligence.types";

@Injectable()
export class CapabilityDuplicateDetectorService {
  constructor(private readonly registry: CapabilityRegistryService) {}

  detect(capabilityKey: string): CapabilityDuplicateMatch[] {
    const source = this.registry.get(capabilityKey);
    if (!source) {
      throw new Error(`Capability not found: ${capabilityKey}`);
    }

    return this.registry
      .list()
      .filter(
        (candidate) => candidate.identity.key !== source.identity.key,
      )
      .map((candidate) => {
        const signals: string[] = [];
        let similarity = 0;

        if (candidate.identity.kind === source.identity.kind) {
          similarity += 0.2;
          signals.push("same-kind");
        }

        const sourceTags = new Set(source.tags);
        const sharedTags = candidate.tags.filter((tag) =>
          sourceTags.has(tag),
        );
        if (sharedTags.length > 0) {
          similarity += Math.min(0.35, sharedTags.length * 0.1);
          signals.push(`shared-tags:${sharedTags.join(",")}`);
        }

        const sourceWords = new Set(
          `${source.purpose.summary} ${source.purpose.businessValue}`
            .toLowerCase()
            .split(/\W+/)
            .filter((word) => word.length > 3),
        );
        const candidateWords = new Set(
          `${candidate.purpose.summary} ${candidate.purpose.businessValue}`
            .toLowerCase()
            .split(/\W+/)
            .filter((word) => word.length > 3),
        );
        const overlap = [...sourceWords].filter((word) =>
          candidateWords.has(word),
        );
        const wordSimilarity =
          sourceWords.size === 0
            ? 0
            : overlap.length / sourceWords.size;

        similarity += Math.min(0.35, wordSimilarity * 0.35);
        if (overlap.length > 0) {
          signals.push(`semantic-overlap:${overlap.slice(0, 8).join(",")}`);
        }

        if (
          source.contracts.some((left) =>
            candidate.contracts.some(
              (right) =>
                left.type === right.type &&
                left.name.toLowerCase() === right.name.toLowerCase(),
            ),
          )
        ) {
          similarity += 0.1;
          signals.push("contract-overlap");
        }

        similarity = Math.min(1, similarity);

        return {
          sourceCapabilityKey: source.identity.key,
          candidateCapabilityKey: candidate.identity.key,
          similarity,
          matchedSignals: signals,
          recommendation:
            similarity >= CAPABILITY_INTELLIGENCE_THRESHOLDS.duplicateMerge
              ? "MERGE"
              : similarity >=
                  CAPABILITY_INTELLIGENCE_THRESHOLDS.duplicateReview
                ? "REVIEW"
                : "KEEP_SEPARATE",
        } satisfies CapabilityDuplicateMatch;
      })
      .filter((match) => match.recommendation !== "KEEP_SEPARATE")
      .sort((a, b) => b.similarity - a.similarity);
  }
}