"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLedgerService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const audit_severity_enum_1 = require("../enums/audit-severity.enum");
const audit_hash_util_1 = require("../utils/audit-hash.util");
let AuditLedgerService = class AuditLedgerService {
    constructor() {
        this.events = [];
        this.maximumEvents = 10000;
    }
    append(input) {
        const sequence = this.events.length + 1;
        const previousHash = this.events.length > 0
            ? this.events[this.events.length - 1].hash
            : "GENESIS";
        const createdAt = new Date().toISOString();
        const hash = audit_hash_util_1.AuditHashUtil.createHash({
            sequence,
            type: input.type,
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
        const event = {
            id: (0, node_crypto_1.randomUUID)(),
            sequence,
            type: input.type,
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
        };
        this.events.push(event);
        if (this.events.length > this.maximumEvents) {
            this.events.splice(0, this.events.length - this.maximumEvents);
        }
        return this.clone(event);
    }
    findAll(options) {
        const limit = Math.min(Math.max(options?.limit ?? 100, 1), 1000);
        return this.events
            .filter((event) => {
            if (options?.severity &&
                event.severity !== options.severity) {
                return false;
            }
            if (options?.type &&
                event.type !== options.type) {
                return false;
            }
            return true;
        })
            .slice(-limit)
            .reverse()
            .map((event) => this.clone(event));
    }
    findOne(id) {
        const event = this.events.find((item) => item.id === id);
        return event ? this.clone(event) : null;
    }
    getSummary() {
        return {
            total: this.events.length,
            info: this.events.filter((item) => item.severity === audit_severity_enum_1.AuditSeverity.INFO).length,
            warning: this.events.filter((item) => item.severity === audit_severity_enum_1.AuditSeverity.WARNING).length,
            error: this.events.filter((item) => item.severity === audit_severity_enum_1.AuditSeverity.ERROR).length,
            critical: this.events.filter((item) => item.severity === audit_severity_enum_1.AuditSeverity.CRITICAL).length,
            latestSequence: this.events.length > 0 ? this.events[this.events.length - 1].sequence : 0,
            latestHash: this.events.length > 0 ? this.events[this.events.length - 1].hash : "GENESIS",
        };
    }
    verifyIntegrity() {
        let previousHash = "GENESIS";
        for (let index = 0; index < this.events.length; index += 1) {
            const event = this.events[index];
            const expectedHash = audit_hash_util_1.AuditHashUtil.createHash({
                sequence: event.sequence,
                type: event.type,
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
                    totalEvents: this.events.length,
                    verifiedEvents: index,
                    invalidSequence: event.sequence,
                    expectedHash,
                    actualHash: event.hash,
                    checkedAt: new Date().toISOString(),
                };
            }
            previousHash = event.hash;
        }
        return {
            valid: true,
            totalEvents: this.events.length,
            verifiedEvents: this.events.length,
            checkedAt: new Date().toISOString(),
        };
    }
    clone(event) {
        return {
            ...event,
            metadata: event.metadata
                ? { ...event.metadata }
                : undefined,
        };
    }
};
exports.AuditLedgerService = AuditLedgerService;
exports.AuditLedgerService = AuditLedgerService = __decorate([
    (0, common_1.Injectable)()
], AuditLedgerService);
//# sourceMappingURL=audit-ledger.service.js.map