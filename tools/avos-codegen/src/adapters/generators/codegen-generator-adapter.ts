import {
  createHash,
} from "node:crypto";
import {
  CodeGenArtifactDescriptor,
  CodeGenArtifactType,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenGeneratorEngine,
} from "../../generators/codegen-generator-engine";
import {
  CodeGenGeneratorAdapterRequest,
  CodeGenGeneratorAdapterResult,
} from "./codegen-generator-adapter.contracts";

export class CodeGenGeneratorAdapter {
  constructor(
    readonly engine =
      new CodeGenGeneratorEngine(),
  ) {}

  async execute(
    request:
      CodeGenGeneratorAdapterRequest,
  ): Promise<
    CodeGenGeneratorAdapterResult
  > {
    const executed =
      await this.engine.execute(
        request.generatorKey,
        {
          ...request.context,
          dryRun: true,
        },
      );

    const artifacts:
      CodeGenArtifactDescriptor[] =
      executed.result.files.map(
        (file, index) => ({
          id:
            `${request.generatorKey}:${index}:${file.relativePath}`,
          key:
            `${request.generatorKey}.${index}.${file.relativePath}`,
          type:
            this.resolveArtifactType(
              file.relativePath,
            ),
          relativePath:
            file.relativePath,
          content:
            file.content,
          writeMode:
            file.mode,
          dependencies: [],
          tags: [
            "generator-adapter",
            request.generatorKey,
          ],
          metadata: {
            generatorKey:
              request.generatorKey,
            generatedIndex:
              index,
          },
          checksum:
            createHash("sha256")
              .update(
                file.content,
              )
              .digest("hex"),
        }),
      );

    return {
      generatorResult:
        executed.result,
      artifacts,
      warnings:
        [...executed.result.warnings],
      adaptedAt:
        new Date().toISOString(),
    };
  }

  private resolveArtifactType(
    relativePath: string,
  ): CodeGenArtifactType {
    if (
      relativePath.includes(
        ".spec.",
      ) ||
      relativePath.includes(
        ".test.",
      )
    ) {
      return CodeGenArtifactType.TEST;
    }

    if (
      relativePath.endsWith(
        ".md",
      )
    ) {
      return CodeGenArtifactType.DOCUMENTATION;
    }

    if (
      relativePath.includes(
        "manifest",
      )
    ) {
      return CodeGenArtifactType.MANIFEST;
    }

    if (
      relativePath.endsWith(
        ".json",
      )
    ) {
      return CodeGenArtifactType.CONFIGURATION;
    }

    return CodeGenArtifactType.SOURCE;
  }
}
