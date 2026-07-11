"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateArtifactMapper = void 0;
const codegen_artifact_contracts_1 = require("../../artifacts/codegen-artifact.contracts");
const codegen_filesystem_contracts_1 = require("../../filesystem/codegen-filesystem.contracts");
class CodeGenTemplateArtifactMapper {
    map(input) {
        return {
            id: `${input.blueprintKey}:${input.rendered.templateKey}`,
            key: `${input.blueprintKey}.${input.rendered.templateKey}`,
            type: codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE,
            relativePath: input.rendered.targetPath,
            content: input.rendered.content,
            writeMode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
            dependencies: [],
            tags: [
                "blueprint-runtime",
                "template-generated",
            ],
            metadata: {
                blueprintKey: input.blueprintKey,
                templateKey: input.rendered.templateKey,
                order: input.order,
                checksum: input.rendered.checksum ?? "",
            },
            ...(input.rendered.checksum
                ? {
                    checksum: input.rendered.checksum,
                }
                : {}),
        };
    }
}
exports.CodeGenTemplateArtifactMapper = CodeGenTemplateArtifactMapper;
//# sourceMappingURL=codegen-template-artifact-mapper.js.map