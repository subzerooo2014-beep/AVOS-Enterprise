import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

export class GenesisV3WorkspaceIntegrity {
  hash(content: string | Buffer): string {
    return createHash("sha256").update(content).digest("hex");
  }

  async hashFile(filePath: string): Promise<string> {
    return this.hash(await readFile(filePath));
  }
}
