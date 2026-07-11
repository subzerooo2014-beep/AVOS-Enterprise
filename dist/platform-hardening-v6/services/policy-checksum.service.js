"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyChecksumService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
let PolicyChecksumService = class PolicyChecksumService {
    create(payload) {
        const normalized = {
            id: payload.id,
            name: payload.name.trim(),
            description: payload.description.trim(),
            enabled: payload.enabled,
            methods: [...payload.methods]
                .map((item) => item.toUpperCase())
                .sort(),
            pathPrefixes: [...payload.pathPrefixes]
                .map((item) => item.trim())
                .sort(),
            requireApprovalToken: payload.requireApprovalToken,
            blockInProduction: payload.blockInProduction,
            severity: payload.severity,
        };
        return (0, node_crypto_1.createHash)("sha256")
            .update(JSON.stringify(normalized))
            .digest("hex");
    }
};
exports.PolicyChecksumService = PolicyChecksumService;
exports.PolicyChecksumService = PolicyChecksumService = __decorate([
    (0, common_1.Injectable)()
], PolicyChecksumService);
//# sourceMappingURL=policy-checksum.service.js.map