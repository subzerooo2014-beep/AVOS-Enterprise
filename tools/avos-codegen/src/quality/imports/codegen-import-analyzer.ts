export interface CodeGenImportRecord {
  source: string;
  specifiers: string[];
  typeOnly: boolean;
  line: number;
  raw: string;
}

export class CodeGenImportAnalyzer {
  analyze(
    content: string,
  ): CodeGenImportRecord[] {
    const lines =
      content.split(/\r?\n/);

    const records:
      CodeGenImportRecord[] = [];

    for (
      let index = 0;
      index < lines.length;
      index += 1
    ) {
      const line =
        lines[index] ?? "";

      const match =
        line.match(
          /^import\s+(type\s+)?(.+?)\s+from\s+["'](.+?)["'];?$/,
        );

      if (!match) {
        continue;
      }

      const specifierText =
        match[2] ?? "";

      const specifiers =
        specifierText
          .replace(/[{}]/g, "")
          .split(",")
          .map(
            (value) =>
              value.trim(),
          )
          .filter(Boolean);

      records.push({
        source:
          match[3] ?? "",
        specifiers,
        typeOnly:
          Boolean(match[1]),
        line:
          index + 1,
        raw:
          line,
      });
    }

    return records;
  }
}
