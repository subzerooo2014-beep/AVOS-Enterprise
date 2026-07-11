"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenImportAnalyzer = void 0;
class CodeGenImportAnalyzer {
    analyze(content) {
        const lines = content.split(/\r?\n/);
        const records = [];
        for (let index = 0; index < lines.length; index += 1) {
            const line = lines[index] ?? "";
            const match = line.match(/^import\s+(type\s+)?(.+?)\s+from\s+["'](.+?)["'];?$/);
            if (!match) {
                continue;
            }
            const specifierText = match[2] ?? "";
            const specifiers = specifierText
                .replace(/[{}]/g, "")
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean);
            records.push({
                source: match[3] ?? "",
                specifiers,
                typeOnly: Boolean(match[1]),
                line: index + 1,
                raw: line,
            });
        }
        return records;
    }
}
exports.CodeGenImportAnalyzer = CodeGenImportAnalyzer;
//# sourceMappingURL=codegen-import-analyzer.js.map