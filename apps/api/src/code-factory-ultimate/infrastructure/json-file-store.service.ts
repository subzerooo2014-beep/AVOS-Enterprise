import { Injectable } from "@nestjs/common";
import { promises as fs } from "node:fs";
import * as path from "node:path";

@Injectable()
export class JsonFileStoreService {
  readonly root = path.resolve(process.cwd(), ".avos-data", "code-factory", "ultimate-v1");

  async initialize(): Promise<void> {
    for (const name of ["jobs", "dead-letter", "workers", "packages", "plans", "certifications", "audit", "materialized"]) {
      await fs.mkdir(path.join(this.root, name), { recursive: true });
    }
  }

  path(...parts: string[]): string {
    const safeParts = parts.map((part) => this.sanitizePathPart(part));
    return path.join(this.root, ...safeParts);
  }

  private sanitizePathPart(part: string): string {
    const sanitized = part
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_")
      .replace(/[. ]+$/g, "");

    if (!sanitized || sanitized === "." || sanitized === "..") {
      throw new Error(`Invalid persistence path segment: ${part}`);
    }

    return sanitized;
  }

  async writeJson(filePath: string, value: unknown): Promise<void> {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const temporary = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(temporary, JSON.stringify(value, null, 2), "utf8");
    await fs.rename(temporary, filePath);
  }

  async readJson<T>(filePath: string): Promise<T | undefined> {
    try { return JSON.parse(await fs.readFile(filePath, "utf8")) as T; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
      throw error;
    }
  }

  async listJson<T>(directory: string): Promise<T[]> {
    await fs.mkdir(directory, { recursive: true });
    const names = (await fs.readdir(directory)).filter((name: string) => name.endsWith(".json"));
    const values: Array<T | undefined> = [];
    for (const name of names) {
      values.push(await this.readJson<T>(path.join(directory, name)));
    }
    const records: T[] = [];
    for (const value of values) {
      if (value !== undefined) records.push(value);
    }
    return records;
  }

  async remove(filePath: string): Promise<void> { await fs.rm(filePath, { force: true }); }
}


