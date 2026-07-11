"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenHelpCommand = void 0;
class CodeGenHelpCommand {
    key = "help";
    name = "CodeGen Help";
    description = "Displays available AVOS CodeGen commands";
    aliases = [
        "--help",
        "-h",
    ];
    execute(_context) {
        return {
            success: true,
            command: this.key,
            message: "AVOS CodeGen OS commands",
            data: {
                commands: [
                    "help",
                    "doctor",
                    "list",
                    "inspect <key>",
                    "preview <key> --mode blueprint|generator|template",
                    "generate <key> --mode blueprint|generator|template",
                ],
            },
        };
    }
}
exports.CodeGenHelpCommand = CodeGenHelpCommand;
//# sourceMappingURL=codegen-help.command.js.map