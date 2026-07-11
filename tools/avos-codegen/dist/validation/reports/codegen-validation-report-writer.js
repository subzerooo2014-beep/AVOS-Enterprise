"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenValidationReportWriter = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class CodeGenValidationReportWriter {
    async write(filePath, report) {
        await (0, promises_1.mkdir)((0, node_path_1.dirname)(filePath), {
            recursive: true,
        });
        await (0, promises_1.writeFile)(filePath, JSON.stringify(report, null, 2), "utf8");
        return filePath;
    }
}
exports.CodeGenValidationReportWriter = CodeGenValidationReportWriter;
//# sourceMappingURL=codegen-validation-report-writer.js.map