import { Injectable } from "@nestjs/common";
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
} from "node:fs";
import { relative, resolve as resolvePath } from "node:path";

export interface InspectionListFilesOptions {
  readonly recursive?: boolean;
  readonly maxFiles?: number;
  readonly relative?: boolean;
}

@Injectable()
export class InspectionFileSystemService {
  resolve(...segments: readonly string[]): string {
    return resolvePath(...segments);
  }

  resolvePath(...segments: readonly string[]): string {
    return this.resolve(...segments);
  }

  exists(path: string): boolean {
    return existsSync(path);
  }

  readText(path: string): string {
    return readFileSync(path, "utf8");
  }

  listFiles(
    root: string,
    limitOrOptions?: number | InspectionListFilesOptions,
  ): readonly string[] {
    if (!existsSync(root)) {
      return [];
    }

    const options: InspectionListFilesOptions =
      typeof limitOrOptions === "number"
        ? {
            recursive: true,
            maxFiles: limitOrOptions,
            relative: true,
          }
        : {
            recursive: limitOrOptions?.recursive ?? true,
            maxFiles: limitOrOptions?.maxFiles ?? 10000,
            relative: limitOrOptions?.relative ?? true,
          };

    const maxFiles = Math.max(1, options.maxFiles ?? 10000);
    const results: string[] = [];

    const visit = (directory: string): void => {
      if (results.length >= maxFiles) {
        return;
      }

      const entries = readdirSync(directory);

      for (const entry of entries) {
        if (results.length >= maxFiles) {
          return;
        }

        const absolutePath = resolvePath(directory, entry);
        const stat = statSync(absolutePath);

        if (stat.isDirectory()) {
          if (options.recursive !== false) {
            visit(absolutePath);
          }

          continue;
        }

        results.push(
          options.relative === false
            ? absolutePath
            : relative(root, absolutePath).replace(/\\/g, "/"),
        );
      }
    };

    visit(root);
    return results;
  }
}
