"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerationReportEngine = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
class CodeGenGenerationReportEngine {
    async write(report, targetRoot, filePath) {
        const outputPath = filePath ??
            (0, node_path_1.join)(targetRoot, ".avos-codegen", "generation-report.json");
        await (0, promises_1.mkdir)((0, node_path_1.dirname)(outputPath), {
            recursive: true,
        });
        await (0, promises_1.writeFile)(outputPath, JSON.stringify(report, null, 2), "utf8");
        return outputPath;
    }
}
exports.CodeGenGenerationReportEngine = CodeGenGenerationReportEngine;
//# sourceMappingURL=codegen-generation-report-engine.js.map