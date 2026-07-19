import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class FoundationUltraPackEFileStoreService {
  private readonly root = path.join(
    process.cwd(),
    ".avos",
    "foundation-ultra-pack-e",
  );

  private sanitizePathPart(value: string): string {
    return value
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "_")
      .replace(/\.+$/g, "_");
  }

  private ensureDir(dir: string): void {
    fs.mkdirSync(dir, { recursive: true });
  }

  file(...parts: string[]): string {
    const safeSegments = parts.flatMap((part) =>
      part
        .split(/[\\/]+/)
        .filter((segment) => segment.length > 0)
        .map((segment) => this.sanitizePathPart(segment)),
    );

    return path.join(this.root, ...safeSegments);
  }

  writeJson(relativePath: string, value: unknown): void {
    const target = this.file(relativePath);
    this.ensureDir(path.dirname(target));
    const temp = `${target}.tmp`;

    fs.writeFileSync(temp, JSON.stringify(value, null, 2), "utf8");

    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
    }

    fs.renameSync(temp, target);
  }

  readJson<T>(relativePath: string, fallback: T): T {
    const target = this.file(relativePath);

    if (!fs.existsSync(target)) {
      return fallback;
    }

    try {
      return JSON.parse(fs.readFileSync(target, "utf8")) as T;
    } catch {
      return fallback;
    }
  }

  listJson<T>(directory: string): T[] {
    const dir = this.file(directory);

    if (!fs.existsSync(dir)) {
      return [];
    }

    const results: T[] = [];

    for (const name of fs.readdirSync(dir)) {
      const target = path.join(dir, name);

      if (!fs.statSync(target).isFile() || !name.endsWith(".json")) {
        continue;
      }

      try {
        results.push(JSON.parse(fs.readFileSync(target, "utf8")) as T);
      } catch {
        // Preserve runtime availability if a record is malformed.
      }
    }

    return results;
  }
}