import {
  createHash,
} from "node:crypto";
import {
  CodeGenArtifactDescriptor,
  CodeGenArtifactType,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenWriteMode,
} from "../../filesystem/codegen-filesystem.contracts";
import {
  CodeGenTemplateEngine,
} from "../../templates/codegen-template-engine";
import {
  CodeGenJsonValue,
  CodeGenMetadata,
} from "../../core/codegen.contracts";

export interface CodeGenTemplateArtifactPipelineRequest {
  templateKeys: readonly string[];
  variables:
    Record<
      string,
      CodeGenJsonValue
    >;
  strict: boolean;
  metadata?: CodeGenMetadata;
}

export class CodeGenTemplateArtifactPipeline {
  constructor(
    readonly templates =
      new CodeGenTemplateEngine(),
  ) {}

  execute(
    request:
      CodeGenTemplateArtifactPipelineRequest,
  ): CodeGenArtifactDescriptor[] {
    return request.templateKeys.map(
      (templateKey, index) => {
        const rendered =
          this.templates.render(
            templateKey,
            {
              variables:
                request.variables,
              strict:
                request.strict,
            },
          );

        return {
          id:
            `template:${templateKey}`,
          key:
            `template.${templateKey}`,
          type:
            this.resolveArtifactType(
              rendered.targetPath,
            ),
          relativePath:
            rendered.targetPath,
          content:
            rendered.content,
          writeMode:
            CodeGenWriteMode.CREATE,
          dependencies:
            index === 0
              ? []
              : [
                  `template.${request.templateKeys[index - 1]}`,
                ],
          tags: [
            "template-artifact-pipeline",
            templateKey,
          ],
          metadata: {
            templateKey,
            order:
              index,
            ...(request.metadata
              ? request.metadata
              : {}),
          },
          checksum:
            rendered.checksum ??
            createHash("sha256")
              .update(
                rendered.content,
              )
              .digest("hex"),
        };
      },
    );
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

    return CodeGenArtifactType.SOURCE;
  }
}
