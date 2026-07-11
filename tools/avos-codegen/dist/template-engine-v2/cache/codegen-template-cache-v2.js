"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateCacheV2 = void 0;
const node_crypto_1 = require("node:crypto");
class CodeGenTemplateCacheV2 {
    entries = new Map();
    hash(source) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(source)
            .digest("hex");
    }
    get(key, source) {
        const entry = this.entries.get(key);
        if (!entry ||
            entry.sourceHash !==
                this.hash(source)) {
            return undefined;
        }
        entry.hits += 1;
        entry.updatedAt =
            new Date().toISOString();
        return structuredClone(entry.ast);
    }
    put(key, source, ast) {
        const now = new Date().toISOString();
        const existing = this.entries.get(key);
        const entry = {
            key,
            sourceHash: this.hash(source),
            ast: structuredClone(ast),
            createdAt: existing?.createdAt ??
                now,
            updatedAt: now,
            hits: existing?.hits ??
                0,
        };
        this.entries.set(key, entry);
        return structuredClone(entry);
    }
    stats() {
        const values = Array.from(this.entries.values());
        return {
            entries: values.length,
            hits: values.reduce((total, entry) => total + entry.hits, 0),
            generatedAt: new Date().toISOString(),
        };
    }
    clear() {
        this.entries.clear();
    }
}
exports.CodeGenTemplateCacheV2 = CodeGenTemplateCacheV2;
//# sourceMappingURL=codegen-template-cache-v2.js.map