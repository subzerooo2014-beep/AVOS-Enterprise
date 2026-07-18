import { Injectable } from "@nestjs/common";

@Injectable()
export class FailureStackTraceAnalyzerService {
  analyze(stack?: string): string[] {
    if (!stack?.trim()) {
      return [];
    }

    return stack
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => {
        return (
          line.startsWith("at ") ||
          line.includes(".ts:") ||
          line.includes(".js:")
        );
      })
      .slice(0, 20);
  }
}
