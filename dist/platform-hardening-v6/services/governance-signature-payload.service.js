"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceSignaturePayloadService = void 0;
const common_1 = require("@nestjs/common");
let GovernanceSignaturePayloadService = class GovernanceSignaturePayloadService {
    audit(event) {
        return {
            id: event.id,
            sequence: event.sequence,
            eventType: event.eventType,
            severity: event.severity,
            action: event.action,
            message: event.message,
            actor: event.actor ?? null,
            correlationId: event.correlationId ?? null,
            traceId: event.traceId ?? null,
            method: event.method ?? null,
            path: event.path ?? null,
            statusCode: event.statusCode ?? null,
            metadata: event.metadata ?? {},
            previousHash: event.previousHash,
            hash: event.hash,
            createdAt: this.toIso(event.createdAt),
        };
    }
    policy(version) {
        return {
            id: version.id,
            policyId: version.policyId,
            version: version.version,
            name: version.name,
            description: version.description,
            enabled: version.enabled,
            methods: version.methods,
            pathPrefixes: version.pathPrefixes,
            requireApprovalToken: version.requireApprovalToken,
            blockInProduction: version.blockInProduction,
            severity: version.severity,
            changeType: version.changeType,
            changeReason: version.changeReason ?? null,
            changedBy: version.changedBy ?? null,
            correlationId: version.correlationId ?? null,
            traceId: version.traceId ?? null,
            restoredFromVersion: version.restoredFromVersion ?? null,
            checksum: version.checksum,
            createdAt: this.toIso(version.createdAt),
        };
    }
    toIso(value) {
        return value instanceof Date
            ? value.toISOString()
            : value;
    }
};
exports.GovernanceSignaturePayloadService = GovernanceSignaturePayloadService;
exports.GovernanceSignaturePayloadService = GovernanceSignaturePayloadService = __decorate([
    (0, common_1.Injectable)()
], GovernanceSignaturePayloadService);
//# sourceMappingURL=governance-signature-payload.service.js.map