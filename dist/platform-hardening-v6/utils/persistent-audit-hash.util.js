"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersistentAuditHashUtil = void 0;
const node_crypto_1 = require("node:crypto");
class PersistentAuditHashUtil {
    static create(input) {
        const createdAt = input.createdAt instanceof Date
            ? input.createdAt.toISOString()
            : input.createdAt;
        const payload = JSON.stringify({
            sequence: input.sequence,
            eventType: input.eventType,
            severity: input.severity,
            action: input.action,
            message: input.message,
            actor: input.actor ?? null,
            correlationId: input.correlationId ?? null,
            traceId: input.traceId ?? null,
            method: input.method ?? null,
            path: input.path ?? null,
            statusCode: input.statusCode ?? null,
            metadata: input.metadata ?? {},
            previousHash: input.previousHash,
            createdAt,
        });
        return (0, node_crypto_1.createHash)("sha256")
            .update(payload)
            .digest("hex");
    }
}
exports.PersistentAuditHashUtil = PersistentAuditHashUtil;
//# sourceMappingURL=persistent-audit-hash.util.js.map