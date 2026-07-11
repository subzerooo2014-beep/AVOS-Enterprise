"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditHashUtil = void 0;
const node_crypto_1 = require("node:crypto");
class AuditHashUtil {
    static createHash(input) {
        const payload = JSON.stringify({
            sequence: input.sequence,
            type: input.type,
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
            createdAt: input.createdAt,
        });
        return (0, node_crypto_1.createHash)("sha256")
            .update(payload)
            .digest("hex");
    }
}
exports.AuditHashUtil = AuditHashUtil;
//# sourceMappingURL=audit-hash.util.js.map