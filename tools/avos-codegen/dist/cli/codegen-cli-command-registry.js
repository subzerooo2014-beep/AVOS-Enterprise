"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenCliCommandRegistry = void 0;
const codegen_errors_1 = require("../core/codegen.errors");
class CodeGenCliCommandRegistry {
    commands = new Map();
    register(command, replace = false) {
        if (this.commands.has(command.key) &&
            !replace) {
            throw new codegen_errors_1.CodeGenValidationError(`CLI command already exists: ${command.key}`);
        }
        this.commands.set(command.key, command);
        for (const alias of command.aliases) {
            if (this.commands.has(alias) &&
                !replace) {
                throw new codegen_errors_1.CodeGenValidationError(`CLI command alias already exists: ${alias}`);
            }
            this.commands.set(alias, command);
        }
        return command;
    }
    get(key) {
        const command = this.commands.get(key);
        if (!command) {
            throw new codegen_errors_1.CodeGenValidationError(`CLI command was not found: ${key}`);
        }
        return command;
    }
    list() {
        const unique = new Map();
        for (const command of this.commands.values()) {
            unique.set(command.key, command);
        }
        return Array.from(unique.values())
            .sort((a, b) => a.key.localeCompare(b.key));
    }
    has(key) {
        return this.commands.has(key);
    }
    clear() {
        this.commands.clear();
    }
}
exports.CodeGenCliCommandRegistry = CodeGenCliCommandRegistry;
//# sourceMappingURL=codegen-cli-command-registry.js.map