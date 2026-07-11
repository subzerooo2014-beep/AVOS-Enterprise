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
var RuntimeEvidenceChainService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeEvidenceChainService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_resilience_store_1 = require("../stores/runtime-resilience.store");
const runtime_hash_util_1 = require("../utils/runtime-hash.util");
let RuntimeEvidenceChainService = RuntimeEvidenceChainService_1 = class RuntimeEvidenceChainService {
    constructor(store) {
        this.store = store;
    }
    append(input) {
        const latest = this.store.getLatestEvidenceEntry();
        const sequence = (latest?.sequence ?? 0) + 1;
        const previousHash = latest?.entryHash ?? RuntimeEvidenceChainService_1.GENESIS_HASH;
        const createdAt = new Date().toISOString();
        const payloadHash = (0, runtime_hash_util_1.sha256Json)(input.payload);
        const entryHash = (0, runtime_hash_util_1.buildEvidenceEntryHash)({
            sequence,
            type: input.type,
            aggregateType: input.aggregateType,
            aggregateId: input.aggregateId,
            actor: input.actor,
            payloadHash,
            previousHash,
            createdAt,
        });
        return this.store.appendEvidence({
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
        return this.store.listEvidenceEntries();
    }
    verify() {
        const entries = this.store
            .listEvidenceEntries()
            .sort((a, b) => a.sequence - b.sequence);
        let previousHash = RuntimeEvidenceChainService_1.GENESIS_HASH;
        for (let index = 0; index < entries.length; index += 1) {
            const entry = entries[index];
            const expectedSequence = index + 1;
            const actualPayloadHash = (0, runtime_hash_util_1.sha256Json)(entry.payload);
            if (entry.sequence !== expectedSequence) {
                return {
                    valid: false,
                    checkedEntries: index,
                    firstSequence: entries.length > 0 ? entries[0].sequence : undefined,
                    lastSequence: entries.length > 0 ? entries[entries.length - 1].sequence : undefined,
                    brokenSequence: entry.sequence,
                    expectedHash: String(expectedSequence),
                    actualHash: String(entry.sequence),
                    verifiedAt: new Date().toISOString(),
                };
            }
            if (entry.previousHash !== previousHash) {
                return {
                    valid: false,
                    checkedEntries: index,
                    firstSequence: entries.length > 0 ? entries[0].sequence : undefined,
                    lastSequence: entries.length > 0 ? entries[entries.length - 1].sequence : undefined,
                    brokenSequence: entry.sequence,
                    expectedHash: previousHash,
                    actualHash: entry.previousHash,
                    verifiedAt: new Date().toISOString(),
                };
            }
            if (entry.payloadHash !== actualPayloadHash) {
                return {
                    valid: false,
                    checkedEntries: index,
                    firstSequence: entries.length > 0 ? entries[0].sequence : undefined,
                    lastSequence: entries.length > 0 ? entries[entries.length - 1].sequence : undefined,
                    brokenSequence: entry.sequence,
                    expectedHash: actualPayloadHash,
                    actualHash: entry.payloadHash,
                    verifiedAt: new Date().toISOString(),
                };
            }
            const expectedEntryHash = (0, runtime_hash_util_1.buildEvidenceEntryHash)({
                sequence: entry.sequence,
                type: entry.type,
                aggregateType: entry.aggregateType,
                aggregateId: entry.aggregateId,
                actor: entry.actor,
                payloadHash: entry.payloadHash,
                previousHash: entry.previousHash,
                createdAt: entry.createdAt,
            });
            if (entry.entryHash !== expectedEntryHash) {
                return {
                    valid: false,
                    checkedEntries: index,
                    firstSequence: entries.length > 0 ? entries[0].sequence : undefined,
                    lastSequence: entries.length > 0 ? entries[entries.length - 1].sequence : undefined,
                    brokenSequence: entry.sequence,
                    expectedHash: expectedEntryHash,
                    actualHash: entry.entryHash,
                    verifiedAt: new Date().toISOString(),
                };
            }
            previousHash = entry.entryHash;
        }
        return {
            valid: true,
            checkedEntries: entries.length,
            firstSequence: entries.length > 0 ? entries[0].sequence : undefined,
            lastSequence: entries.length > 0 ? entries[entries.length - 1].sequence : undefined,
            verifiedAt: new Date().toISOString(),
        };
    }
};
exports.RuntimeEvidenceChainService = RuntimeEvidenceChainService;
RuntimeEvidenceChainService.GENESIS_HASH = "0".repeat(64);
exports.RuntimeEvidenceChainService = RuntimeEvidenceChainService = RuntimeEvidenceChainService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_resilience_store_1.RuntimeResilienceStore])
], RuntimeEvidenceChainService);
//# sourceMappingURL=runtime-evidence-chain.service.js.map