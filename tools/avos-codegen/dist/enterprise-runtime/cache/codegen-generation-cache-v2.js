"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeGenGenerationCacheV2 = void 0;
const node_crypto_1 = require("node:crypto");
class CodeGenGenerationCacheV2 {
    entries = new Map();
    hits = 0;
    misses = 0;
    fingerprint(artifact) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(JSON.stringify({
            key: artifact.key,
            relativePath: artifact.relativePath,
            content: artifact.content,
            dependencies: artifact.dependencies,
            metadata: artifact.metadata,
        }))
            .digest("hex");
    }
    get(artifact) {
        const key = artifact.key;
        const entry = this.entries.get(key);
        const fingerprint = this.fingerprint(artifact);
        if (!entry ||
            entry.fingerprint !==
                fingerprint) {
            this.misses += 1;
            return undefined;
        }
        entry.hits += 1;
        entry.updatedAt =
            new Date().toISOString();
        this.hits += 1;
        return structuredClone(entry);
    }
    put(artifact) {
        const now = new Date().toISOString();
        const existing = this.entries.get(artifact.key);
        const entry = {
            key: artifact.key,
            fingerprint: this.fingerprint(artifact),
            artifact: structuredClone(artifact),
            metadata: {
                relativePath: artifact.relativePath,
                artifactType: artifact.type,
            },
            createdAt: existing?.createdAt ??
                now,
            updatedAt: now,
            hits: existing?.hits ??
                0,
        };
        this.entries.set(artifact.key, entry);
        return structuredClone(entry);
    }
    remove(key) {
        const entry = this.entries.get(key);
        if (!entry) {
            return undefined;
        }
        this.entries.delete(key);
        return structuredClone(entry);
    }
    stats() {
        const total = this.hits +
            this.misses;
        return {
            entries: this.entries.size,
            hits: this.hits,
            misses: this.misses,
            hitRatio: total === 0
                ? 0
                : this.hits /
                    total,
            generatedAt: new Date().toISOString(),
        };
    }
    clear() {
        this.entries.clear();
        this.hits = 0;
        this.misses = 0;
    }
}
exports.CodeGenGenerationCacheV2 = CodeGenGenerationCacheV2;
//# sourceMappingURL=codegen-generation-cache-v2.js.map