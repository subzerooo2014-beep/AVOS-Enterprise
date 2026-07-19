import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

@Injectable()
export class HashService {
  hashText(value: string): string {
    return createHash("sha256").update(value).digest("hex");
  }

  hashJson(value: unknown): string {
    return this.hashText(JSON.stringify(value));
  }

  async hashFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = createHash("sha256");
      const stream = createReadStream(filePath);

      stream.on("error", reject);
      stream.on("data", (chunk) => hash.update(chunk));
      stream.on("end", () => resolve(hash.digest("hex")));
    });
  }
}