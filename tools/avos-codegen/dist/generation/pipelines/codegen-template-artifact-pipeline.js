"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateArtifactPipeline = void 0;
const node_crypto_1 = require("node:crypto");
const codegen_artifact_contracts_1 = require("../../artifacts/codegen-artifact.contracts");
const codegen_filesystem_contracts_1 = require("../../filesystem/codegen-filesystem.contracts");
const codegen_template_engine_1 = require("../../templates/codegen-template-engine");
class CodeGenTemplateArtifactPipeline {
    templates;
    constructor(templates = new codegen_template_engine_1.CodeGenTemplateEngine()) {
        this.templates = templates;
    }
    execute(request) {
        return request.templateKeys.map((templateKey, index) => {
            const rendered = this.templates.render(templateKey, {
                variables: request.variables,
                strict: request.strict,
            });
            return {
                id: `template:${templateKey}`,
                key: `template.${templateKey}`,
                type: this.resolveArtifactType(rendered.targetPath),
                relativePath: rendered.targetPath,
                content: rendered.content,
                writeMode: codegen_filesystem_contracts_1.CodeGenWriteMode.CREATE,
                dependencies: index === 0
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
                    order: index,
                    ...(request.metadata
                        ? request.metadata
                        : {}),
                },
                checksum: rendered.checksum ??
                    (0, node_crypto_1.createHash)("sha256")
                        .update(rendered.content)
                        .digest("hex"),
            };
        });
    }
    resolveArtifactType(relativePath) {
        if (relativePath.includes(".spec.") ||
            relativePath.includes(".test.")) {
            return codegen_artifact_contracts_1.CodeGenArtifactType.TEST;
        }
        if (relativePath.endsWith(".md")) {
            return codegen_artifact_contracts_1.CodeGenArtifactType.DOCUMENTATION;
        }
        if (relativePath.includes("manifest")) {
            return codegen_artifact_contracts_1.CodeGenArtifactType.MANIFEST;
        }
        return codegen_artifact_contracts_1.CodeGenArtifactType.SOURCE;
    }
}
exports.CodeGenTemplateArtifactPipeline = CodeGenTemplateArtifactPipeline;
//# sourceMappingURL=codegen-template-artifact-pipeline.js.map