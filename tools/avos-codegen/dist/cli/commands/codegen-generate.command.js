"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerateCommand = void 0;
const codegen_generation_command_base_1 = require("./codegen-generation-command.base");
class CodeGenGenerateCommand extends codegen_generation_command_base_1.CodeGenGenerationCommandBase {
    key = "generate";
    name = "Generate Code";
    description = "Generates code from blueprint, generator, or template";
    aliases = [
        "gen",
        "g",
    ];
    execute(context) {
        return this.runGeneration(context, false);
    }
}
exports.CodeGenGenerateCommand = CodeGenGenerateCommand;
//# sourceMappingURL=codegen-generate.command.js.map