import {
  mkdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import {
  dirname,
  extname,
  relative,
  resolve,
} from "node:path";
import {
  CodeGenValidationError,
} from "../core/codegen.errors";
import {
  CodeGenFileDescriptor,
  CodeGenWriteFileInput,
  CodeGenWriteFileResult,
  CodeGenWriteMode,
} from "./codegen-filesystem.contracts";

export class CodeGenFileSystemEngine {
  async describe(
    workspaceRoot: string,
    targetPath: string,
  ): Promise<CodeGenFileDescriptor> {
    const absolutePath = resolve(targetPath);
    const relativePath = relative(
      resolve(workspaceRoot),
      absolutePath,
    );

    try {
      const fileStat = await stat(absolutePath);

      return {
        absolutePath,
        relativePath,
        exists: true,
        sizeBytes: fileStat.size,
        extension: extname(absolutePath),
        createdAt: fileStat.birthtime.toISOString(),
        updatedAt: fileStat.mtime.toISOString(),
      };
    } catch {
      return {
        absolutePath,
        relativePath,
        exists: false,
        sizeBytes: 0,
        extension: extname(absolutePath),
      };
    }
  }

  async read(
    targetPath: string,
    encoding: BufferEncoding = "utf8",
  ): Promise<string> {
    return readFile(
      resolve(targetPath),
      encoding,
    );
  }

  async write(
    input: CodeGenWriteFileInput,
  ): Promise<CodeGenWriteFileResult> {
    const absolutePath = resolve(
      input.absolutePath,
    );

    const descriptor = await this.describe(
      process.cwd(),
      absolutePath,
    );

    if (
      descriptor.exists &&
      input.mode === CodeGenWriteMode.CREATE
    ) {
      throw new CodeGenValidationError(
        `File already exists: ${absolutePath}`,
      );
    }

    if (
      descriptor.exists &&
      input.mode === CodeGenWriteMode.SKIP
    ) {
      return {
        absolutePath,
        mode: input.mode,
        written: false,
        skipped: true,
        bytes: descriptor.sizeBytes,
        createdAt: new Date().toISOString(),
      };
    }

    await mkdir(
      dirname(absolutePath),
      { recursive: true },
    );

    let content = input.content;

    if (
      descriptor.exists &&
      input.mode === CodeGenWriteMode.MERGE
    ) {
      const current = await this.read(
        absolutePath,
        input.encoding ?? "utf8",
      );

      content = `${current}${current.endsWith("\n") ? "" : "\n"}${input.content}`;
    }

    await writeFile(
      absolutePath,
      content,
      {
        encoding: input.encoding ?? "utf8",
      },
    );

    return {
      absolutePath,
      mode: input.mode,
      written: true,
      skipped: false,
      bytes: Buffer.byteLength(
        content,
        input.encoding ?? "utf8",
      ),
      createdAt: new Date().toISOString(),
    };
  }
}
