"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.governanceSha256Text = governanceSha256Text;
exports.governanceSha256Json = governanceSha256Json;
exports.buildGovernanceAuditHash = buildGovernanceAuditHash;
const crypto_1 = require("crypto");
const governance_canonical_json_util_1 = require("./governance-canonical-json.util");
function governanceSha256Text(value) {
    return (0, crypto_1.createHash)("sha256")
        .update(value, "utf8")
        .digest("hex");
}
function governanceSha256Json(value) {
    return governanceSha256Text((0, governance_canonical_json_util_1.canonicalizeGovernanceJson)(value));
}
function buildGovernanceAuditHash(input) {
    return governanceSha256Json(input);
}
//# sourceMappingURL=governance-hash.util.js.map