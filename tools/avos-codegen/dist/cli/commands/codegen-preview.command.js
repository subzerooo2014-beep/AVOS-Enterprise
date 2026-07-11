"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenPreviewCommand = void 0;
const codegen_generation_command_base_1 = require("./codegen-generation-command.base");
class CodeGenPreviewCommand extends codegen_generation_command_base_1.CodeGenGenerationCommandBase {
    key = "preview";
    name = "Preview Generation";
    description = "Runs generation without writing files";
    aliases = [
        "plan",
        "dry-run",
    ];
    execute(context) {
        return this.runGeneration(context, true);
    }
}
exports.CodeGenPreviewCommand = CodeGenPreviewCommand;
//# sourceMappingURL=codegen-preview.command.js.map