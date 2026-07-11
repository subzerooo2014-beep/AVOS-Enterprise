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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvidenceChainService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const mega_pack_6_constants_1 = require("./constants/mega-pack-6.constants");
const enterprise_sequence_service_1 = require("./enterprise-sequence.service");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
let EvidenceChainService = class EvidenceChainService {
    constructor(storage, sequence) {
        this.storage = storage;
        this.sequence = sequence;
    }
    async append(dto) {
        const entries = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.evidenceChain);
        const previous = entries
            .slice()
            .sort((a, b) => b.sequenceNumber -
            a.sequenceNumber)[0];
        const sequenceNumber = previous
            ? previous.sequenceNumber + 1
            : 1;
        const previousHash = previous?.chainHash ??
            "GENESIS";
        const recordedAt = new Date().toISOString();
        const payloadHash = this.hash({
            evidenceType: dto.evidenceType,
            sourceType: dto.sourceType,
            sourceId: dto.sourceId,
            title: dto.title,
            description: dto.description,
            createdBy: dto.createdBy,
            payload: dto.payload,
            metadata: dto.metadata ?? {},
            recordedAt,
        });
        const chainHash = this.hash({
            sequenceNumber,
            previousHash,
            payloadHash,
        });
        const entry = {
            id: (0, node_crypto_1.randomUUID)(),
            sequenceNumber,
            evidenceCode: this.sequence.next("AVOS-EVC"),
            evidenceType: dto.evidenceType,
            sourceType: dto.sourceType,
            sourceId: dto.sourceId,
            title: dto.title,
            description: dto.description,
            createdBy: dto.createdBy,
            payload: dto.payload,
            metadata: dto.metadata ?? {},
            previousHash,
            payloadHash,
            chainHash,
            recordedAt,
            createdAt: recordedAt,
            updatedAt: recordedAt,
        };
        entries.push(entry);
        await this.storage.writeCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.evidenceChain, entries);
        return entry;
    }
    async list() {
        const entries = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.evidenceChain);
        return entries.sort((a, b) => a.sequenceNumber -
            b.sequenceNumber);
    }
    async verify() {
        const entries = await this.list();
        let validEntries = 0;
        let invalidEntries = 0;
        let brokenAtSequence;
        let expectedHash;
        let observedHash;
        for (let index = 0; index < entries.length; index += 1) {
            const entry = entries[index];
            const expectedPreviousHash = index === 0
                ? "GENESIS"
                : entries[index - 1]
                    .chainHash;
            const recalculatedPayloadHash = this.hash({
                evidenceType: entry.evidenceType,
                sourceType: entry.sourceType,
                sourceId: entry.sourceId,
                title: entry.title,
                description: entry.description,
                createdBy: entry.createdBy,
                payload: entry.payload,
                metadata: entry.metadata,
                recordedAt: entry.recordedAt,
            });
            const recalculatedChainHash = this.hash({
                sequenceNumber: entry.sequenceNumber,
                previousHash: expectedPreviousHash,
                payloadHash: recalculatedPayloadHash,
            });
            const valid = entry.previousHash ===
                expectedPreviousHash &&
                entry.payloadHash ===
                    recalculatedPayloadHash &&
                entry.chainHash ===
                    recalculatedChainHash;
            if (valid) {
                validEntries += 1;
                continue;
            }
            invalidEntries += 1;
            if (brokenAtSequence ===
                undefined) {
                brokenAtSequence =
                    entry.sequenceNumber;
                expectedHash =
                    recalculatedChainHash;
                observedHash =
                    entry.chainHash;
            }
        }
        return {
            verified: invalidEntries === 0,
            totalEntries: entries.length,
            validEntries,
            invalidEntries,
            brokenAtSequence,
            expectedHash,
            observedHash,
            verifiedAt: new Date().toISOString(),
        };
    }
    async latest() {
        const entries = await this.list();
        return entries.length > 0
            ? entries[entries.length - 1]
            : null;
    }
    hash(value) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(this.stableStringify(value))
            .digest("hex");
    }
    stableStringify(value) {
        if (value === null ||
            typeof value !== "object") {
            return JSON.stringify(value);
        }
        if (Array.isArray(value)) {
            return `[${value
                .map((item) => this.stableStringify(item))
                .join(",")}]`;
        }
        const record = value;
        return `{${Object.keys(record)
            .sort()
            .map((key) => `${JSON.stringify(key)}:${this.stableStringify(record[key])}`)
            .join(",")}}`;
    }
};
exports.EvidenceChainService = EvidenceChainService;
exports.EvidenceChainService = EvidenceChainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mega_pack_6_storage_service_1.MegaPack6StorageService,
        enterprise_sequence_service_1.EnterpriseSequenceService])
], EvidenceChainService);
//# sourceMappingURL=evidence-chain.service.js.map