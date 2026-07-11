import {
  CodeGenMetadata,
} from "../../core/codegen.contracts";

export interface CodeGenTelemetrySpan {
  id: string;
  name: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  success?: boolean;
  metadata: CodeGenMetadata;
}

export interface CodeGenTelemetrySnapshot {
  spans: CodeGenTelemetrySpan[];
  activeSpans: number;
  completedSpans: number;
  failedSpans: number;
  generatedAt: string;
}
