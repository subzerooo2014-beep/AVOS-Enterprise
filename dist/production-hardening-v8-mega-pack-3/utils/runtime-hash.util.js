"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256Text = sha256Text;
exports.sha256Json = sha256Json;
exports.buildEvidenceEntryHash = buildEvidenceEntryHash;
const crypto_1 = require("crypto");
const canonical_json_util_1 = require("./canonical-json.util");
function sha256Text(value) {
    return (0, crypto_1.createHash)("sha256").update(value, "utf8").digest("hex");
}
function sha256Json(value) {
    return sha256Text((0, canonical_json_util_1.canonicalizeJson)(value));
}
function buildEvidenceEntryHash(input) {
    return sha256Json({
        sequence: input.sequence,
        type: input.type,
        aggregateType: input.aggregateType,
        aggregateId: input.aggregateId,
        actor: input.actor,
        payloadHash: input.payloadHash,
        previousHash: input.previousHash,
        createdAt: input.createdAt,
    });
}
//# sourceMappingURL=runtime-hash.util.js.map