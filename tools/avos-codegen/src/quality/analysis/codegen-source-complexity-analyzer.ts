export interface CodeGenSourceComplexity {
  lines: number;
  nonEmptyLines: number;
  imports: number;
  classes: number;
  functions: number;
  branches: number;
  estimatedComplexity: number;
}

export class CodeGenSourceComplexityAnalyzer {
  analyze(
    content: string,
  ): CodeGenSourceComplexity {
    const lines =
      content.split(/\r?\n/);

    const imports =
      lines.filter(
        (line) =>
          line.trim().startsWith(
            "import ",
          ),
      ).length;

    const classes =
      (
        content.match(
          /\bclass\s+[A-Za-z0-9_]+/g,
        ) ?? []
      ).length;

    const functions =
      (
        content.match(
          /\b(?:async\s+)?[A-Za-z0-9_]+\s*\([^)]*\)\s*(?::[^{]+)?\{/g,
        ) ?? []
      ).length;

    const branches =
      (
        content.match(
          /\b(if|for|while|switch|case|catch)\b/g,
        ) ?? []
      ).length;

    return {
      lines:
        lines.length,
      nonEmptyLines:
        lines.filter(
          (line) =>
            line.trim().length >
            0,
        ).length,
      imports,
      classes,
      functions,
      branches,
      estimatedComplexity:
        1 + branches,
    };
  }
}
