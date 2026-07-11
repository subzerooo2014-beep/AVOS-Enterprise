"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenTemplateCache = void 0;
class CodeGenTemplateCache {
    entries = new Map();
    hitCount = 0;
    missCount = 0;
    get(key, checksum) {
        const entry = this.entries.get(key);
        if (!entry ||
            (checksum !== undefined &&
                entry.checksum !== checksum)) {
            this.missCount += 1;
            return undefined;
        }
        entry.hits += 1;
        entry.lastAccessedAt =
            new Date().toISOString();
        this.hitCount += 1;
        return structuredClone(entry.compiled);
    }
    set(compiled) {
        const now = new Date().toISOString();
        this.entries.set(compiled.key, {
            key: compiled.key,
            checksum: compiled.checksum,
            compiled: structuredClone(compiled),
            hits: 0,
            createdAt: now,
            lastAccessedAt: now,
        });
        return structuredClone(compiled);
    }
    has(key, checksum) {
        const entry = this.entries.get(key);
        if (!entry) {
            return false;
        }
        return checksum === undefined ||
            entry.checksum === checksum;
    }
    remove(key) {
        return this.entries.delete(key);
    }
    clear() {
        this.entries.clear();
        this.hitCount = 0;
        this.missCount = 0;
    }
    snapshot() {
        return {
            size: this.entries.size,
            hits: this.hitCount,
            misses: this.missCount,
            entries: Array.from(this.entries.values())
                .map((entry) => ({
                key: entry.key,
                checksum: entry.checksum,
                hits: entry.hits,
                createdAt: entry.createdAt,
                lastAccessedAt: entry.lastAccessedAt,
            }))
                .sort((left, right) => left.key.localeCompare(right.key)),
            generatedAt: new Date().toISOString(),
        };
    }
}
exports.CodeGenTemplateCache = CodeGenTemplateCache;
//# sourceMappingURL=codegen-template-cache.js.map