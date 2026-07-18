import { Injectable } from "@nestjs/common";

@Injectable()
export class FailureDependencyAnalyzerService {
  analyze(
    message: string,
    stack?: string
  ): string[] {
    const source = `${message}\n${stack ?? ""}`;
    const hints = new Set<string>();

    const patterns = [
      /cannot find module\s+['"]([^'"]+)['"]/gi,
      /module\s+['"]([^'"]+)['"]/gi,
      /from\s+['"]([^'"]+)['"]/gi
    ];

    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern)) {
        if (match[1]) {
          hints.add(match[1]);
        }
      }
    }

    return [...hints].slice(0, 20);
  }
}
