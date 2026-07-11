import {
  createHash,
} from "node:crypto";
import {
  readFile,
  stat,
} from "node:fs/promises";
import {
  CodeGenFileFingerprint,
} from "../codegen-output.contracts";

export class CodeGenFileFingerprintEngine {
  async fingerprint(
    absolutePath: string,
  ): Promise<CodeGenFileFingerprint> {
    try {
      const [content, fileStat] =
        await Promise.all([
          readFile(absolutePath),
          stat(absolutePath),
        ]);

      return {
        absolutePath,
        exists: true,
        sizeBytes: fileStat.size,
        checksum:
          createHash("sha256")
            .update(content)
            .digest("hex"),
        modifiedAt:
          fileStat.mtime.toISOString(),
        generatedAt:
          new Date().toISOString(),
      };
    } catch {
      return {
        absolutePath,
        exists: false,
        sizeBytes: 0,
        generatedAt:
          new Date().toISOString(),
      };
    }
  }

  fingerprintContent(
    absolutePath: string,
    content: string,
  ): CodeGenFileFingerprint {
    return {
      absolutePath,
      exists: true,
      sizeBytes:
        Buffer.byteLength(
          content,
          "utf8",
        ),
      checksum:
        createHash("sha256")
          .update(content)
          .digest("hex"),
      generatedAt:
        new Date().toISOString(),
    };
  }
}
