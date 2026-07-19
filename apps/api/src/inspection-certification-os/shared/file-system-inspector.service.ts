import { Injectable } from "@nestjs/common";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

@Injectable()
export class FileSystemInspectorService {
  exists(path: string): boolean {
    return existsSync(path);
  }

  readText(path: string): string {
    return readFileSync(path, "utf8");
  }

  listFiles(root: string, maxFiles = 5_000): string[] {
    if (!existsSync(root)) {
      return [];
    }

    const result: string[] = [];
    const queue = [root];

    while (queue.length > 0 && result.length < maxFiles) {
      const current = queue.shift();
      if (!current) {
        break;
      }

      for (const item of readdirSync(current)) {
        if (
          item === "node_modules" ||
          item === ".git" ||
          item === "dist" ||
          item === ".next" ||
          item === ".avos-backups"
        ) {
          continue;
        }

        const absolute = join(current, item);
        const stats = statSync(absolute);

        if (stats.isDirectory()) {
          queue.push(absolute);
        } else {
          result.push(relative(root, absolute).replace(/\\/g, "/"));
        }

        if (result.length >= maxFiles) {
          break;
        }
      }
    }

    return result;
  }

  findMatches(
    root: string,
    patterns: readonly RegExp[],
    extensions: readonly string[],
    maxFiles = 2_000,
  ): Array<{ file: string; matches: string[] }> {
    const files = this.listFiles(root, maxFiles).filter((file) =>
      extensions.some((extension) => file.endsWith(extension)),
    );

    const findings: Array<{ file: string; matches: string[] }> = [];

    for (const file of files) {
      const absolute = join(root, file);
      const text = this.readText(absolute);
      const matches = patterns
        .filter((pattern) => pattern.test(text))
        .map((pattern) => pattern.source);

      if (matches.length > 0) {
        findings.push({ file, matches });
      }
    }

    return findings;
  }
}
