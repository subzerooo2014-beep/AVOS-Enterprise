export enum CodeGenRuntimeLogLevel {
  DEBUG = "debug",
  INFORMATIONAL = "informational",
  WARNING = "warning",
  ERROR = "error",
}

export interface CodeGenRuntimeLogEntry {
  level: CodeGenRuntimeLogLevel;
  message: string;
  context: Record<
    string,
    string | number | boolean
  >;
  createdAt: string;
}

export class CodeGenEnterpriseRuntimeLogger {
  private readonly entries:
    CodeGenRuntimeLogEntry[] =
    [];

  log(
    level:
      CodeGenRuntimeLogLevel,
    message: string,
    context:
      Record<
        string,
        string | number | boolean
      > = {},
  ): CodeGenRuntimeLogEntry {
    const entry:
      CodeGenRuntimeLogEntry = {
      level,
      message,
      context:
        structuredClone(
          context,
        ),
      createdAt:
        new Date().toISOString(),
    };

    this.entries.push(
      entry,
    );

    return structuredClone(
      entry,
    );
  }

  list():
    CodeGenRuntimeLogEntry[] {
    return structuredClone(
      this.entries,
    );
  }

  clear(): void {
    this.entries.length = 0;
  }
}
