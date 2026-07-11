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
var RuntimeExecutionEvidenceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuntimeExecutionEvidenceService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const utils_1 = require("../utils");
let RuntimeExecutionEvidenceService = RuntimeExecutionEvidenceService_1 = class RuntimeExecutionEvidenceService {
    constructor(store) {
        this.store = store;
    }
    append(input) {
        const latest = this.store
            .getLatestExecutionEvidence();
        const sequence = (latest?.sequence ?? 0) + 1;
        const previousHash = latest?.entryHash ??
            RuntimeExecutionEvidenceService_1
                .GENESIS_HASH;
        const createdAt = new Date().toISOString();
        const payloadHash = (0, utils_1.governanceSha256Json)(input.payload);
        const entryHash = (0, utils_1.governanceSha256Json)({
            sequence,
            changeExecutionId: input.changeExecutionId,
            runbookExecutionId: input.runbookExecutionId ??
                null,
            stepExecutionId: input.stepExecutionId ??
                null,
            type: input.type,
            actor: input.actor,
            payloadHash,
            previousHash,
            createdAt,
        });
        return this.store
            .appendExecutionEvidence({
            id: (0, crypto_1.randomUUID)(),
            sequence,
            changeExecutionId: input.changeExecutionId,
            runbookExecutionId: input.runbookExecutionId,
            stepExecutionId: input.stepExecutionId,
            type: input.type,
            actor: input.actor,
            payload: input.payload,
            previousHash,
            payloadHash,
            entryHash,
            createdAt,
        });
    }
    list() {
        return this.store
            .listExecutionEvidence();
    }
    verify() {
        const entries = this.list()
            .sort((a, b) => a.sequence - b.sequence);
        let previousHash = RuntimeExecutionEvidenceService_1
            .GENESIS_HASH;
        for (let index = 0; index < entries.length; index += 1) {
            const entry = entries[index];
            const payloadHash = (0, utils_1.governanceSha256Json)(entry.payload);
            const expectedHash = (0, utils_1.governanceSha256Json)({
                sequence: entry.sequence,
                changeExecutionId: entry.changeExecutionId,
                runbookExecutionId: entry.runbookExecutionId ??
                    null,
                stepExecutionId: entry.stepExecutionId ??
                    null,
                type: entry.type,
                actor: entry.actor,
                payloadHash: entry.payloadHash,
                previousHash: entry.previousHash,
                createdAt: entry.createdAt,
            });
            if (entry.sequence !==
                index + 1 ||
                entry.previousHash !==
                    previousHash ||
                entry.payloadHash !==
                    payloadHash ||
                entry.entryHash !==
                    expectedHash) {
                return {
                    valid: false,
                    checkedEntries: index,
                    brokenSequence: entry.sequence,
                    expectedHash,
                    actualHash: entry.entryHash,
                    verifiedAt: new Date().toISOString(),
                };
            }
            previousHash =
                entry.entryHash;
        }
        return {
            valid: true,
            checkedEntries: entries.length,
            verifiedAt: new Date().toISOString(),
        };
    }
};
exports.RuntimeExecutionEvidenceService = RuntimeExecutionEvidenceService;
RuntimeExecutionEvidenceService.GENESIS_HASH = "0".repeat(64);
exports.RuntimeExecutionEvidenceService = RuntimeExecutionEvidenceService = RuntimeExecutionEvidenceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore])
], RuntimeExecutionEvidenceService);
//# sourceMappingURL=runtime-execution-evidence.service.js.map