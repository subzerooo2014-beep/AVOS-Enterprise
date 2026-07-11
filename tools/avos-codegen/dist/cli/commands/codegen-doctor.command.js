"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenDoctorCommand = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
class CodeGenDoctorCommand {
    key = "doctor";
    name = "CodeGen Doctor";
    description = "Checks AVOS CodeGen runtime health";
    aliases = [
        "health",
        "diagnose",
    ];
    execute(context) {
        const required = [
            "package.json",
            "templates",
            "blueprints",
            "dist",
        ];
        const checks = required.map((path) => ({
            path,
            exists: (0, node_fs_1.existsSync)((0, node_path_1.resolve)(context.cwd, path)),
        }));
        const success = checks.every((check) => check.exists);
        return {
            success,
            command: this.key,
            message: success
                ? "AVOS CodeGen runtime is healthy"
                : "AVOS CodeGen runtime has missing components",
            data: {
                node: process.version,
                platform: process.platform,
                cwd: context.cwd,
                checks,
            },
        };
    }
}
exports.CodeGenDoctorCommand = CodeGenDoctorCommand;
//# sourceMappingURL=codegen-doctor.command.js.map