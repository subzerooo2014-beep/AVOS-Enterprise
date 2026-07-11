"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenInspectCommand = void 0;
const node_path_1 = require("node:path");
const codegen_blueprint_bootstrap_service_1 = require("../../blueprints/bootstrap/codegen-blueprint-bootstrap.service");
const codegen_errors_1 = require("../../core/codegen.errors");
const codegen_cli_json_utilities_1 = require("../runtime/codegen-cli-json.utilities");
class CodeGenInspectCommand {
    bootstrap;
    key = "inspect";
    name = "Inspect CodeGen Asset";
    description = "Inspects a blueprint or template";
    aliases = [
        "show",
        "describe",
    ];
    constructor(bootstrap = new codegen_blueprint_bootstrap_service_1.CodeGenBlueprintBootstrapService()) {
        this.bootstrap = bootstrap;
    }
    async execute(context) {
        const key = context.args[0];
        if (!key) {
            throw new codegen_errors_1.CodeGenValidationError("Asset key is required");
        }
        const result = await this.bootstrap.initialize({
            codegenRoot: (0, node_path_1.resolve)(context.cwd),
            replace: true,
        });
        const blueprint = result.blueprints.find((item) => item.key === key);
        if (blueprint) {
            return {
                success: true,
                command: this.key,
                message: `Blueprint found: ${key}`,
                data: (0, codegen_cli_json_utilities_1.toCodeGenJsonValue)(blueprint),
            };
        }
        const template = result.templates.find((item) => item.key === key);
        if (template) {
            return {
                success: true,
                command: this.key,
                message: `Template found: ${key}`,
                data: (0, codegen_cli_json_utilities_1.toCodeGenJsonValue)({
                    ...template,
                    content: `[${template.content.length} characters]`,
                }),
            };
        }
        throw new codegen_errors_1.CodeGenValidationError(`CodeGen asset was not found: ${key}`);
    }
}
exports.CodeGenInspectCommand = CodeGenInspectCommand;
//# sourceMappingURL=codegen-inspect.command.js.map