import {
  randomUUID,
} from "node:crypto";
import {
  CodeGenJsonValue,
  CodeGenMetadata,
} from "../../core/codegen.contracts";

export enum CodeGenGenerationJournalLevel {
  DEBUG = "debug",
  INFORMATIONAL = "informational",
  WARNING = "warning",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface CodeGenGenerationJournalEntry {
  id: string;
  sequence: number;
  sessionId: string;
  level: CodeGenGenerationJournalLevel;
  code: string;
  message: string;
  artifactKey?: string;
  details: CodeGenMetadata;
  createdAt: string;
}

export class CodeGenGenerationJournal {
  private readonly entries:
    CodeGenGenerationJournalEntry[] = [];

  private sequence = 0;

  write(
    input: {
      sessionId: string;
      level:
        CodeGenGenerationJournalLevel;
      code: string;
      message: string;
      artifactKey?: string;
      details?: Record<
        string,
        CodeGenJsonValue
      >;
    },
  ): CodeGenGenerationJournalEntry {
    this.sequence += 1;

    const entry:
      CodeGenGenerationJournalEntry = {
      id: randomUUID(),
      sequence: this.sequence,
      sessionId: input.sessionId,
      level: input.level,
      code: input.code,
      message: input.message,
      ...(input.artifactKey
        ? {
            artifactKey:
              input.artifactKey,
          }
        : {}),
      details:
        input.details ?? {},
      createdAt:
        new Date().toISOString(),
    };

    this.entries.push(entry);

    return structuredClone(entry);
  }

  list(
    sessionId?: string,
  ): CodeGenGenerationJournalEntry[] {
    return this.entries
      .filter(
        (entry) =>
          !sessionId ||
          entry.sessionId ===
            sessionId,
      )
      .map((entry) =>
        structuredClone(entry),
      );
  }

  clear(): void {
    this.entries.splice(
      0,
      this.entries.length,
    );
    this.sequence = 0;
  }
}
