import {
  createHash,
  randomUUID,
} from "node:crypto";
import {
  mkdir,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
} from "node:path";
import {
  CodeGenAtomicWriteRequest,
  CodeGenAtomicWriteResult,
} from "../codegen-output.contracts";

export class CodeGenAtomicFileWriter {
  async write(
    request:
      CodeGenAtomicWriteRequest,
  ): Promise<
    CodeGenAtomicWriteResult
  > {
    const encoding =
      request.encoding ?? "utf8";

    const directory =
      dirname(
        request.absolutePath,
      );

    await mkdir(
      directory,
      {
        recursive: true,
      },
    );

    const temporaryPath =
      `${request.absolutePath}.avos-codegen-${randomUUID()}.tmp`;

    try {
      await writeFile(
        temporaryPath,
        request.content,
        {
          encoding,
          flag: "wx",
        },
      );

      await rename(
        temporaryPath,
        request.absolutePath,
      );
    } catch (error) {
      await rm(
        temporaryPath,
        {
          force: true,
        },
      );

      throw error;
    }

    return {
      absolutePath:
        request.absolutePath,
      temporaryPath,
      checksum:
        createHash("sha256")
          .update(
            request.content,
          )
          .digest("hex"),
      bytes:
        Buffer.byteLength(
          request.content,
          encoding,
        ),
      writtenAt:
        new Date().toISOString(),
    };
  }
}
