import { Injectable } from "@nestjs/common";
import { promises as fs } from "node:fs";
import * as path from "node:path";

@Injectable()
export class AtomicFileWriterService {
  async writeText(
    targetPath: string,
    content: string,
    encoding: BufferEncoding = "utf8"
  ): Promise<void> {
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    const tempPath = `${targetPath}.${process.pid}.${Date.now()}.tmp`;

    try {
      await fs.writeFile(tempPath, content, { encoding });
      await fs.rename(tempPath, targetPath);
    } catch (error) {
      await fs.rm(tempPath, { force: true }).catch(() => undefined);
      throw error;
    }
  }

  async writeJson(targetPath: string, value: unknown): Promise<void> {
    await this.writeText(targetPath, `${JSON.stringify(value, null, 2)}\n`);
  }
}