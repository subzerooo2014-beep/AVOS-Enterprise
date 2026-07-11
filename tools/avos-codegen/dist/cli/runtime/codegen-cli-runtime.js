"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenCliRuntime = void 0;
const codegen_cli_command_registry_1 = require("../codegen-cli-command-registry");
const codegen_cli_argument_parser_1 = require("../parsing/codegen-cli-argument-parser");
const codegen_cli_output_formatter_1 = require("../formatting/codegen-cli-output-formatter");
const codegen_doctor_command_1 = require("../commands/codegen-doctor.command");
const codegen_generate_command_1 = require("../commands/codegen-generate.command");
const codegen_help_command_1 = require("../commands/codegen-help.command");
const codegen_inspect_command_1 = require("../commands/codegen-inspect.command");
const codegen_list_command_1 = require("../commands/codegen-list.command");
const codegen_preview_command_1 = require("../commands/codegen-preview.command");
class CodeGenCliRuntime {
    registry;
    parser;
    formatter;
    constructor(registry = new codegen_cli_command_registry_1.CodeGenCliCommandRegistry(), parser = new codegen_cli_argument_parser_1.CodeGenCliArgumentParser(), formatter = new codegen_cli_output_formatter_1.CodeGenCliOutputFormatter()) {
        this.registry = registry;
        this.parser = parser;
        this.formatter = formatter;
        this.registerDefaults();
    }
    async run(argv, cwd = process.cwd()) {
        const parsed = this.parser.parse(argv);
        try {
            const command = this.registry.get(parsed.command);
            const result = await command.execute({
                args: parsed.args,
                options: parsed.options,
                cwd,
            });
            return {
                success: result.success,
                command: result.command,
                message: result.message,
                ...(result.data !==
                    undefined
                    ? {
                        data: result.data,
                    }
                    : {}),
                errors: [],
                warnings: [],
                executedAt: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                command: parsed.command,
                message: "Command execution failed",
                errors: [
                    error instanceof Error
                        ? error.message
                        : String(error),
                ],
                warnings: [],
                executedAt: new Date().toISOString(),
            };
        }
    }
    registerDefaults() {
        const commands = [
            new codegen_help_command_1.CodeGenHelpCommand(),
            new codegen_doctor_command_1.CodeGenDoctorCommand(),
            new codegen_list_command_1.CodeGenListCommand(),
            new codegen_inspect_command_1.CodeGenInspectCommand(),
            new codegen_preview_command_1.CodeGenPreviewCommand(),
            new codegen_generate_command_1.CodeGenGenerateCommand(),
        ];
        for (const command of commands) {
            if (!this.registry.has(command.key)) {
                this.registry.register(command);
            }
        }
    }
}
exports.CodeGenCliRuntime = CodeGenCliRuntime;
//# sourceMappingURL=codegen-cli-runtime.js.map