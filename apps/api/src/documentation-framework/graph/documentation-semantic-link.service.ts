import { Injectable } from "@nestjs/common";
import {
  DocumentationGraphLink,
  DocumentationGraphNode,
} from "./documentation-graph.types";

@Injectable()
export class DocumentationSemanticLinkService {
  generate(
    nodes: DocumentationGraphNode[],
    minimumSimilarity = 0.1,
  ): DocumentationGraphLink[] {
    const threshold = this.clamp(minimumSimilarity, 0, 1);
    const links: DocumentationGraphLink[] = [];

    for (let leftIndex = 0; leftIndex < nodes.length; leftIndex += 1) {
      for (
        let rightIndex = leftIndex + 1;
        rightIndex < nodes.length;
        rightIndex += 1
      ) {
        const source = nodes[leftIndex];
        const target = nodes[rightIndex];
        const similarity = this.similarity(source, target);

        if (similarity >= threshold) {
          links.push({
            id: `semantic:${source.id}:${target.id}`,
            sourceId: source.id,
            targetId: target.id,
            kind: "semantic",
            similarity,
            generatedBy: "avos-documentation-semantic-link-engine",
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    return links;
  }

  status() {
    return {
      name: "AVOS Documentation Semantic Link Engine",
      status: "operational",
      algorithm: "normalized-keyword-jaccard",
      humanFinalAuthority: true,
    };
  }

  private similarity(
    source: DocumentationGraphNode,
    target: DocumentationGraphNode,
  ): number {
    const sourceTokens = this.tokens(source);
    const targetTokens = this.tokens(target);

    const intersection = Array.from(sourceTokens).filter((token) =>
      targetTokens.has(token),
    ).length;
    const union = new Set<string>([
      ...Array.from(sourceTokens),
      ...Array.from(targetTokens),
    ]).size;

    if (union === 0) {
      return 0;
    }

    return Number((intersection / union).toFixed(4));
  }

  private tokens(node: DocumentationGraphNode): Set<string> {
    return new Set(
      [node.title, node.description, ...node.keywords]
        .join(" ")
        .toLowerCase()
        .split(/[^a-z0-9]+/g)
        .map((token) => token.trim())
        .filter((token) => token.length > 2),
    );
  }

  private clamp(value: number, minimum: number, maximum: number): number {
    if (!Number.isFinite(value)) {
      return minimum;
    }
    return Math.min(maximum, Math.max(minimum, value));
  }
}