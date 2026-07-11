import {
  CodeGenArtifactDescriptor,
  CodeGenArtifactType,
} from "../../artifacts/codegen-artifact.contracts";
import {
  CodeGenWriteMode,
} from "../../filesystem/codegen-filesystem.contracts";
import {
  CodeGenRenderedTemplate,
} from "../../templates/codegen-template.contracts";

export class CodeGenTemplateArtifactMapper {
  map(
    input: {
      blueprintKey: string;
      rendered:
        CodeGenRenderedTemplate;
      order: number;
    },
  ): CodeGenArtifactDescriptor {
    return {
      id:
        `${input.blueprintKey}:${input.rendered.templateKey}`,
      key:
        `${input.blueprintKey}.${input.rendered.templateKey}`,
      type:
        CodeGenArtifactType.SOURCE,
      relativePath:
        input.rendered.targetPath,
      content:
        input.rendered.content,
      writeMode:
        CodeGenWriteMode.CREATE,
      dependencies: [],
      tags: [
        "blueprint-runtime",
        "template-generated",
      ],
      metadata: {
        blueprintKey:
          input.blueprintKey,
        templateKey:
          input.rendered.templateKey,
        order:
          input.order,
        checksum:
          input.rendered.checksum ?? "",
      },
      ...(input.rendered.checksum
        ? {
            checksum:
              input.rendered.checksum,
          }
        : {}),
    };
  }
}
