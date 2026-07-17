import { Injectable } from "@nestjs/common";
import {
  IngestKnowledgeInput,
  NormalizedKnowledgeDocument,
} from "./knowledge-ingestion.types";

@Injectable()
export class KnowledgeNormalizationService {
  normalize(input: IngestKnowledgeInput): NormalizedKnowledgeDocument {
    const sourceId = input.sourceId?.trim() || this.createSourceId(input);
    const normalizedText = this.normalizeContent(input.content, input.format);
    const title = input.title?.trim() || this.deriveTitle(normalizedText);
    const checksum = this.checksum(`${input.source}|${input.format}|${normalizedText}`);
    const now = new Date().toISOString();

    return {
      id: `knowledge-document:${checksum}`,
      sourceId,
      source: input.source.trim(),
      format: input.format,
      title,
      normalizedText,
      checksum,
      wordCount: this.wordCount(normalizedText),
      metadata: {
        ...(input.metadata ?? {}),
        originalLength: input.content.length,
        normalizedLength: normalizedText.length,
        normalizedBy: "AVOS-KF2",
      },
      status: "normalized",
      ingestedAt: now,
    };
  }

  private normalizeContent(content: string, format: IngestKnowledgeInput["format"]): string {
    const trimmed = content.trim();
    if (!trimmed) {
      throw new Error("Knowledge content cannot be empty.");
    }

    if (format === "json") {
      const parsed: unknown = JSON.parse(trimmed);
      return JSON.stringify(parsed, null, 2);
    }

    if (format === "markdown") {
      return trimmed
        .replace(/\r\n/g, "\n")
        .replace(/[ \t]+$/gm, "")
        .replace(/\n{3,}/g, "\n\n");
    }

    return trimmed
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+/g, " ")
      .replace(/\n{3,}/g, "\n\n");
  }

  private deriveTitle(content: string): string {
    const firstLine = content.split("\n")[0]?.replace(/^#+\s*/, "").trim();
    if (firstLine) {
      return firstLine.slice(0, 120);
    }
    return "Untitled Knowledge Document";
  }

  private wordCount(content: string): number {
    return content.split(/\s+/).filter(Boolean).length;
  }

  private createSourceId(input: IngestKnowledgeInput): string {
    return `${input.source}:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`;
  }

  private checksum(value: string): string {
    let hash = 2166136261;
    for (let index = 0; index < value.length; index += 1) {
      hash ^= value.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }
}