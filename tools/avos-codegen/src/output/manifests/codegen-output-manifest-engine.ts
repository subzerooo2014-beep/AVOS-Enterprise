import {
  createHash,
  randomUUID,
} from "node:crypto";
import {
  mkdir,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
  join,
  resolve,
} from "node:path";
import {
  CodeGenOutputManifest,
  CodeGenOutputManifestEntry,
} from "../codegen-output.contracts";

export class CodeGenOutputManifestEngine {
  create(
    input: {
      sessionId: string;
      workspaceRoot: string;
      targetRoot: string;
      entries:
        readonly CodeGenOutputManifestEntry[];
    },
  ): CodeGenOutputManifest {
    const payload =
      JSON.stringify(
        input.entries,
      );

    return {
      id: randomUUID(),
      sessionId:
        input.sessionId,
      workspaceRoot:
        resolve(
          input.workspaceRoot,
        ),
      targetRoot:
        resolve(
          input.targetRoot,
        ),
      entries:
        structuredClone(
          [...input.entries],
        ),
      checksum:
        createHash("sha256")
          .update(payload)
          .digest("hex"),
      generatedAt:
        new Date().toISOString(),
    };
  }

  async write(
    manifest:
      CodeGenOutputManifest,
    filePath?: string,
  ): Promise<string> {
    const outputPath =
      filePath ??
      join(
        manifest.targetRoot,
        ".avos-codegen",
        "output-manifest.json",
      );

    await mkdir(
      dirname(outputPath),
      {
        recursive: true,
      },
    );

    await writeFile(
      outputPath,
      JSON.stringify(
        manifest,
        null,
        2,
      ),
      "utf8",
    );

    return outputPath;
  }
}
