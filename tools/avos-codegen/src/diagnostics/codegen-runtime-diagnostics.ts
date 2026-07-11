import { randomUUID } from "node:crypto";
import {
  CodeGenDiagnosticLevel,
  CodeGenDiagnosticRecord,
  CodeGenDiagnosticsSnapshot,
  CodeGenMetadata,
} from "../core/codegen.contracts";

export interface WriteDiagnosticInput {
  level: CodeGenDiagnosticLevel;
  code: string;
  message: string;
  source: string;
  executionId?: string;
  details?: CodeGenMetadata;
}

export class CodeGenRuntimeDiagnostics {
  private readonly records:
    CodeGenDiagnosticRecord[] = [];

  private sequence = 0;

  write(
    input: WriteDiagnosticInput,
  ): CodeGenDiagnosticRecord {
    this.sequence += 1;

    const record:
      CodeGenDiagnosticRecord = {
      id: randomUUID(),
      sequence: this.sequence,
      level: input.level,
      code: input.code,
      message: input.message,
      source: input.source,
      ...(input.executionId
        ? {
            executionId:
              input.executionId,
          }
        : {}),
      details: input.details ?? {},
      createdAt:
        new Date().toISOString(),
    };

    this.records.push(record);

    return structuredClone(record);
  }

  debug(
    code: string,
    message: string,
    source: string,
    details: CodeGenMetadata = {},
  ): CodeGenDiagnosticRecord {
    return this.write({
      level:
        CodeGenDiagnosticLevel.DEBUG,
      code,
      message,
      source,
      details,
    });
  }

  info(
    code: string,
    message: string,
    source: string,
    details: CodeGenMetadata = {},
  ): CodeGenDiagnosticRecord {
    return this.write({
      level:
        CodeGenDiagnosticLevel.INFORMATIONAL,
      code,
      message,
      source,
      details,
    });
  }

  warning(
    code: string,
    message: string,
    source: string,
    details: CodeGenMetadata = {},
  ): CodeGenDiagnosticRecord {
    return this.write({
      level:
        CodeGenDiagnosticLevel.WARNING,
      code,
      message,
      source,
      details,
    });
  }

  error(
    code: string,
    message: string,
    source: string,
    details: CodeGenMetadata = {},
  ): CodeGenDiagnosticRecord {
    return this.write({
      level:
        CodeGenDiagnosticLevel.ERROR,
      code,
      message,
      source,
      details,
    });
  }

  critical(
    code: string,
    message: string,
    source: string,
    details: CodeGenMetadata = {},
  ): CodeGenDiagnosticRecord {
    return this.write({
      level:
        CodeGenDiagnosticLevel.CRITICAL,
      code,
      message,
      source,
      details,
    });
  }

  list(): CodeGenDiagnosticRecord[] {
    return this.records.map(
      (record) =>
        structuredClone(record),
    );
  }

  snapshot():
    CodeGenDiagnosticsSnapshot {
    const records = this.list();

    const count = (
      level: CodeGenDiagnosticLevel,
    ) =>
      records.filter(
        (record) =>
          record.level === level,
      ).length;

    const errors =
      count(
        CodeGenDiagnosticLevel.ERROR,
      );

    const critical =
      count(
        CodeGenDiagnosticLevel.CRITICAL,
      );

    return {
      total: records.length,
      debug:
        count(
          CodeGenDiagnosticLevel.DEBUG,
        ),
      informational:
        count(
          CodeGenDiagnosticLevel.INFORMATIONAL,
        ),
      warnings:
        count(
          CodeGenDiagnosticLevel.WARNING,
        ),
      errors,
      critical,
      healthy:
        errors === 0 &&
        critical === 0,
      generatedAt:
        new Date().toISOString(),
    };
  }

  clear(): void {
    this.records.splice(
      0,
      this.records.length,
    );

    this.sequence = 0;
  }
}
