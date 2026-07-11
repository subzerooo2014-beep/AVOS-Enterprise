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
exports.PersistentAuditLedgerService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const persistent_audit_hash_util_1 = require("../utils/persistent-audit-hash.util");
const persistent_audit_repository_1 = require("./persistent-audit.repository");
const governance_signature_payload_service_1 = require("./governance-signature-payload.service");
const governance_signature_service_1 = require("./governance-signature.service");
let PersistentAuditLedgerService = class PersistentAuditLedgerService {
    constructor(repository, signatures, signaturePayloads) {
        this.repository = repository;
        this.signatures = signatures;
        this.signaturePayloads = signaturePayloads;
        this.writeQueue = Promise.resolve();
    }
    append(input) {
        const operation = this.writeQueue.then(() => this.appendInternal(input));
        this.writeQueue = operation.catch(() => undefined);
        return operation;
    }
    async appendInternal(input) {
        const latest = await this.repository.findLatest();
        const sequence = latest ? latest.sequence + 1 : 1;
        const previousHash = latest?.hash ?? "GENESIS";
        const createdAt = new Date();
        const hash = persistent_audit_hash_util_1.PersistentAuditHashUtil.create({
            sequence,
            eventType: input.eventType,
            severity: input.severity,
            action: input.action,
            message: input.message,
            actor: input.actor,
            correlationId: input.correlationId,
            traceId: input.traceId,
            method: input.method,
            path: input.path,
            statusCode: input.statusCode,
            metadata: input.metadata,
            previousHash,
            createdAt,
        });
        const unsignedRecord = {
            id: "pending",
            sequence,
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
            previousHash,
            hash,
            createdAt,
        };
        try {
            const created = await this.repository.create({
                sequence,
                eventType: input.eventType,
                severity: input.severity,
                action: input.action,
                message: input.message,
                actor: input.actor,
                correlationId: input.correlationId,
                traceId: input.traceId,
                method: input.method,
                path: input.path,
                statusCode: input.statusCode,
                metadata: input.metadata,
                previousHash,
                hash,
                createdAt,
            });
            const signature = this.signatures.signPayload(this.signaturePayloads.audit(created));
            return this.repository.model.update({
                where: {
                    id: created.id,
                },
                data: {
                    signature: signature.signature,
                    signatureAlgorithm: signature.algorithm,
                    signatureKeyId: signature.keyId,
                    signedAt: new Date(signature.signedAt),
                },
            });
        }
        catch (error) {
            if (error instanceof
                client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002") {
                throw new common_1.ConflictException({
                    success: false,
                    message: "Persistent audit sequence or hash conflict detected",
                    sequence,
                });
            }
            throw error;
        }
    }
    async findMany(input) {
        const limit = Math.min(Math.max(input?.limit ?? 100, 1), 1000);
        return this.repository.findMany({
            limit,
            eventType: input?.eventType,
            severity: input?.severity,
            actor: input?.actor,
            correlationId: input?.correlationId,
        });
    }
    async findOne(id) {
        const event = await this.repository.findById(id);
        if (!event) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Persistent audit event ${id} was not found`,
            });
        }
        return event;
    }
    async findBySequence(sequence) {
        const event = await this.repository.findBySequence(sequence);
        if (!event) {
            throw new common_1.NotFoundException({
                success: false,
                message: `Persistent audit sequence ${sequence} was not found`,
            });
        }
        return event;
    }
    async getSummary() {
        const [total, latest, first, severityCounts, typeCounts,] = await Promise.all([
            this.repository.count(),
            this.repository.findLatest(),
            this.repository.findFirst(),
            this.repository.getSeverityCounts(),
            this.repository.getTypeCounts(),
        ]);
        return {
            total,
            firstSequence: first?.sequence ?? 0,
            latestSequence: latest?.sequence ?? 0,
            genesisHash: first?.previousHash ?? "GENESIS",
            latestHash: latest?.hash ?? "GENESIS",
            severityCounts: Object.fromEntries(severityCounts.map((item) => [
                item.severity,
                item._count._all,
            ])),
            eventTypeCounts: Object.fromEntries(typeCounts.map((item) => [
                item.eventType,
                item._count._all,
            ])),
        };
    }
    async verifyIntegrity() {
        const events = await this.repository.findAllAscending();
        let previousHash = "GENESIS";
        let expectedSequence = 1;
        for (let index = 0; index < events.length; index += 1) {
            const event = events[index];
            if (event.sequence !== expectedSequence) {
                return {
                    valid: false,
                    totalEvents: events.length,
                    verifiedEvents: index,
                    firstSequence: events[0]?.sequence,
                    lastSequence: events[events.length - 1]?.sequence,
                    invalidSequence: event.sequence,
                    checkedAt: new Date().toISOString(),
                };
            }
            const expectedHash = persistent_audit_hash_util_1.PersistentAuditHashUtil.create({
                sequence: event.sequence,
                eventType: event.eventType,
                severity: event.severity,
                action: event.action,
                message: event.message,
                actor: event.actor,
                correlationId: event.correlationId,
                traceId: event.traceId,
                method: event.method,
                path: event.path,
                statusCode: event.statusCode,
                metadata: event.metadata,
                previousHash,
                createdAt: event.createdAt,
            });
            if (event.previousHash !== previousHash ||
                event.hash !== expectedHash) {
                return {
                    valid: false,
                    totalEvents: events.length,
                    verifiedEvents: index,
                    firstSequence: events[0]?.sequence,
                    lastSequence: events[events.length - 1]?.sequence,
                    invalidSequence: event.sequence,
                    expectedPreviousHash: previousHash,
                    actualPreviousHash: event.previousHash,
                    expectedHash,
                    actualHash: event.hash,
                    checkedAt: new Date().toISOString(),
                };
            }
            previousHash = event.hash;
            expectedSequence += 1;
        }
        return {
            valid: true,
            totalEvents: events.length,
            verifiedEvents: events.length,
            firstSequence: events[0]?.sequence,
            lastSequence: events.length > 0
                ? events[events.length - 1].sequence
                : undefined,
            checkedAt: new Date().toISOString(),
        };
    }
};
exports.PersistentAuditLedgerService = PersistentAuditLedgerService;
exports.PersistentAuditLedgerService = PersistentAuditLedgerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [persistent_audit_repository_1.PersistentAuditRepository,
        governance_signature_service_1.GovernanceSignatureService,
        governance_signature_payload_service_1.GovernanceSignaturePayloadService])
], PersistentAuditLedgerService);
//# sourceMappingURL=persistent-audit-ledger.service.js.map