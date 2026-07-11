import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";
import {
  CodeGenTelemetrySnapshot,
  CodeGenTelemetrySpan,
} from "./codegen-telemetry.contracts";

export class CodeGenRuntimeTelemetryCollector {
  private readonly spans =
    new Map<
      string,
      CodeGenTelemetrySpan
    >();

  start(
    name: string,
    metadata:
      CodeGenMetadata = {},
  ): CodeGenTelemetrySpan {
    const span:
      CodeGenTelemetrySpan = {
      id:
        randomUUID(),
      name,
      startedAt:
        new Date().toISOString(),
      metadata:
        structuredClone(
          metadata,
        ),
    };

    this.spans.set(
      span.id,
      span,
    );

    return structuredClone(
      span,
    );
  }

  complete(
    spanId: string,
    success = true,
    metadata:
      CodeGenMetadata = {},
  ): CodeGenTelemetrySpan {
    const span =
      this.spans.get(
        spanId,
      );

    if (!span) {
      throw new Error(
        `Telemetry span was not found: ${spanId}`,
      );
    }

    const completedAt =
      new Date().toISOString();

    span.completedAt =
      completedAt;

    span.durationMs =
      Date.parse(
        completedAt,
      ) -
      Date.parse(
        span.startedAt,
      );

    span.success =
      success;

    span.metadata = {
      ...span.metadata,
      ...metadata,
    };

    return structuredClone(
      span,
    );
  }

  snapshot():
    CodeGenTelemetrySnapshot {
    const spans =
      Array.from(
        this.spans.values(),
      )
        .map(
          (span) =>
            structuredClone(span),
        );

    return {
      spans,
      activeSpans:
        spans.filter(
          (span) =>
            !span.completedAt,
        ).length,
      completedSpans:
        spans.filter(
          (span) =>
            Boolean(
              span.completedAt,
            ),
        ).length,
      failedSpans:
        spans.filter(
          (span) =>
            span.success ===
            false,
        ).length,
      generatedAt:
        new Date().toISOString(),
    };
  }

  clear(): void {
    this.spans.clear();
  }
}
