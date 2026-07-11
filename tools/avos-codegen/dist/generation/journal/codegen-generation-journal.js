"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerationJournal = exports.CodeGenGenerationJournalLevel = void 0;
const node_crypto_1 = require("node:crypto");
var CodeGenGenerationJournalLevel;
(function (CodeGenGenerationJournalLevel) {
    CodeGenGenerationJournalLevel["DEBUG"] = "debug";
    CodeGenGenerationJournalLevel["INFORMATIONAL"] = "informational";
    CodeGenGenerationJournalLevel["WARNING"] = "warning";
    CodeGenGenerationJournalLevel["ERROR"] = "error";
    CodeGenGenerationJournalLevel["CRITICAL"] = "critical";
})(CodeGenGenerationJournalLevel || (exports.CodeGenGenerationJournalLevel = CodeGenGenerationJournalLevel = {}));
class CodeGenGenerationJournal {
    entries = [];
    sequence = 0;
    write(input) {
        this.sequence += 1;
        const entry = {
            id: (0, node_crypto_1.randomUUID)(),
            sequence: this.sequence,
            sessionId: input.sessionId,
            level: input.level,
            code: input.code,
            message: input.message,
            ...(input.artifactKey
                ? {
                    artifactKey: input.artifactKey,
                }
                : {}),
            details: input.details ?? {},
            createdAt: new Date().toISOString(),
        };
        this.entries.push(entry);
        return structuredClone(entry);
    }
    list(sessionId) {
        return this.entries
            .filter((entry) => !sessionId ||
            entry.sessionId ===
                sessionId)
            .map((entry) => structuredClone(entry));
    }
    clear() {
        this.entries.splice(0, this.entries.length);
        this.sequence = 0;
    }
}
exports.CodeGenGenerationJournal = CodeGenGenerationJournal;
//# sourceMappingURL=codegen-generation-journal.js.map