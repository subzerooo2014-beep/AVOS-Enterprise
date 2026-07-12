import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export class WorkspaceHashVerifier {
  hashContent(content: string): string {
    return createHash("sha256").update(content).digest("hex");
  }

  async hashFile(filePath: string): Promise<string> {
    const content = await readFile(filePath);
    return createHash("sha256").update(content).digest("hex");
  }

  async verifyFile(
    filePath: string,
    expectedHash: string,
  ): Promise<boolean> {
    return (await this.hashFile(filePath)) === expectedHash;
  }
}
