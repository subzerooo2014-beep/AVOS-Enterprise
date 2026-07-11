"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenListCommand = void 0;
const node_path_1 = require("node:path");
const codegen_blueprint_bootstrap_service_1 = require("../../blueprints/bootstrap/codegen-blueprint-bootstrap.service");
class CodeGenListCommand {
    bootstrap;
    key = "list";
    name = "List CodeGen Assets";
    description = "Lists discovered blueprints and templates";
    aliases = [
        "ls",
    ];
    constructor(bootstrap = new codegen_blueprint_bootstrap_service_1.CodeGenBlueprintBootstrapService()) {
        this.bootstrap = bootstrap;
    }
    async execute(context) {
        const result = await this.bootstrap.initialize({
            codegenRoot: (0, node_path_1.resolve)(context.cwd),
            replace: true,
        });
        return {
            success: true,
            command: this.key,
            message: "CodeGen assets discovered",
            data: {
                blueprints: result.blueprints.map((blueprint) => ({
                    key: blueprint.key,
                    name: blueprint.name,
                    category: blueprint.category,
                    templates: blueprint
                        .templateBindings
                        .length,
                })),
                templates: result.templates.map((template) => ({
                    key: template.key,
                    name: template.name,
                    targetPath: template.targetPath,
                })),
                warnings: result.warnings,
            },
        };
    }
}
exports.CodeGenListCommand = CodeGenListCommand;
//# sourceMappingURL=codegen-list.command.js.map