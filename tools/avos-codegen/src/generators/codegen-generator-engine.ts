import {
  resolve,
} from "node:path";
import {
  CodeGenFileSystemEngine,
} from "../filesystem/codegen-filesystem-engine";
import {
  CodeGenWriteFileResult,
} from "../filesystem/codegen-filesystem.contracts";
import {
  CodeGenGeneratorContext,
  CodeGenGeneratorResult,
} from "./codegen-generator.contracts";
import {
  CodeGenGeneratorRegistry,
} from "./codegen-generator-registry";

export interface ExecuteGeneratorResult {
  result: CodeGenGeneratorResult;
  writes: CodeGenWriteFileResult[];
}

export class CodeGenGeneratorEngine {
  constructor(
    readonly registry =
      new CodeGenGeneratorRegistry(),
    readonly fileSystem =
      new CodeGenFileSystemEngine(),
  ) {}

  async execute(
    key: string,
    context: CodeGenGeneratorContext,
  ): Promise<ExecuteGeneratorResult> {
    const generator =
      this.registry.get(key);

    const result =
      await generator.generate(context);

    const writes:
      CodeGenWriteFileResult[] = [];

    if (
      result.success &&
      !context.dryRun
    ) {
      for (const file of result.files) {
        writes.push(
          await this.fileSystem.write({
            absolutePath: resolve(
              context.targetRoot,
              file.relativePath,
            ),
            content: file.content,
            mode: file.mode,
          }),
        );
      }
    }

    return {
      result,
      writes,
    };
  }
}
