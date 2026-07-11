"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RuntimeGovernanceAuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeGovernanceAuditService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
let RuntimeGovernanceAuditService = RuntimeGovernanceAuditService_1 = class RuntimeGovernanceAuditService {
    constructor(store) {
        this.store = store;
    }
    append(input) {
        const latest = this.store.getLatestAuditEntry();
        const sequence = (latest?.sequence ?? 0) + 1;
        const previousHash = latest?.entryHash ??
            RuntimeGovernanceAuditService_1
                .GENESIS_HASH;
        const createdAt = new Date().toISOString();
        const payloadHash = (0, utils_1.governanceSha256Json)(input.payload);
        const entryHash = (0, utils_1.buildGovernanceAuditHash)({
            sequence,
            type: input.type,
            aggregateType: input.aggregateType,
            aggregateId: input.aggregateId,
            actor: input.actor,
            payloadHash,
            previousHash,
            createdAt,
        });
        return this.store.appendAuditEntry({
            id: (0, crypto_1.randomUUID)(),
            sequence,
            type: input.type,
            aggregateType: input.aggregateType,
            aggregateId: input.aggregateId,
            actor: input.actor,
            payload: input.payload,
            metadata: input.metadata ?? {},
            previousHash,
            payloadHash,
            entryHash,
            createdAt,
        });
    }
    list() {
        return this.store.listAuditEntries();
    }
    verify() {
        const entries = this.store
            .listAuditEntries()
            .sort((a, b) => a.sequence - b.sequence);
        let previousHash = RuntimeGovernanceAuditService_1
            .GENESIS_HASH;
        for (let index = 0; index < entries.length; index += 1) {
            const entry = entries[index];
            const expectedSequence = index + 1;
            const actualPayloadHash = (0, utils_1.governanceSha256Json)(entry.payload);
            if (entry.sequence !==
                expectedSequence) {
                return this.failure(entries, index, entry.sequence, String(expectedSequence), String(entry.sequence));
            }
            if (entry.previousHash !==
                previousHash) {
                return this.failure(entries, index, entry.sequence, previousHash, entry.previousHash);
            }
            if (entry.payloadHash !==
                actualPayloadHash) {
                return this.failure(entries, index, entry.sequence, actualPayloadHash, entry.payloadHash);
            }
            const expectedEntryHash = (0, utils_1.buildGovernanceAuditHash)({
                sequence: entry.sequence,
                type: entry.type,
                aggregateType: entry.aggregateType,
                aggregateId: entry.aggregateId,
                actor: entry.actor,
                payloadHash: entry.payloadHash,
                previousHash: entry.previousHash,
                createdAt: entry.createdAt,
            });
            if (entry.entryHash !==
                expectedEntryHash) {
                return this.failure(entries, index, entry.sequence, expectedEntryHash, entry.entryHash);
            }
            previousHash =
                entry.entryHash;
        }
        return {
            valid: true,
            checkedEntries: entries.length,
            firstSequence: entries.length > 0
                ? entries[0].sequence
                : undefined,
            lastSequence: entries.length > 0
                ? entries[entries.length - 1].sequence
                : undefined,
            verifiedAt: new Date().toISOString(),
        };
    }
    failure(entries, checkedEntries, brokenSequence, expectedHash, actualHash) {
        return {
            valid: false,
            checkedEntries,
            firstSequence: entries.length > 0
                ? entries[0].sequence
                : undefined,
            lastSequence: entries.length > 0
                ? entries[entries.length - 1].sequence
                : undefined,
            brokenSequence,
            expectedHash,
            actualHash,
            verifiedAt: new Date().toISOString(),
        };
    }
};
exports.RuntimeGovernanceAuditService = RuntimeGovernanceAuditService;
RuntimeGovernanceAuditService.GENESIS_HASH = "0".repeat(64);
exports.RuntimeGovernanceAuditService = RuntimeGovernanceAuditService = RuntimeGovernanceAuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore])
], RuntimeGovernanceAuditService);
//# sourceMappingURL=runtime-governance-audit.service.js.map