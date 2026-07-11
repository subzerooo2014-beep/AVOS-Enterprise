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
exports.KeyLifecycleService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const assurance_storage_service_1 = require("./assurance-storage.service");
let KeyLifecycleService = class KeyLifecycleService {
    constructor(storage) {
        this.storage = storage;
        this.collection = "cryptographic-key-lifecycle";
    }
    async register(dto) {
        const records = await this.storage.readCollection(this.collection);
        const currentVersions = records.filter((record) => record.keyAlias === dto.keyAlias);
        const version = currentVersions.length === 0
            ? 1
            : Math.max(...currentVersions.map((record) => record.version)) + 1;
        const now = new Date().toISOString();
        const record = {
            id: (0, node_crypto_1.randomUUID)(),
            keyAlias: dto.keyAlias,
            purpose: dto.purpose,
            algorithm: dto.algorithm,
            provider: dto.provider,
            status: dto.status ?? "planned",
            activatedAt: dto.activatedAt,
            rotationDueAt: dto.rotationDueAt,
            fingerprint: dto.fingerprint ??
                this.createMetadataFingerprint(dto.keyAlias, dto.algorithm, version),
            version,
            metadata: dto.metadata ?? {},
            createdAt: now,
            updatedAt: now,
        };
        records.push(record);
        await this.storage.writeCollection(this.collection, records);
        return record;
    }
    async list() {
        const records = await this.storage.readCollection(this.collection);
        return records.sort((a, b) => a.keyAlias.localeCompare(b.keyAlias) ||
            b.version - a.version);
    }
    async updateStatus(id, status) {
        const record = await this.storage.findById(this.collection, id);
        if (!record) {
            throw new common_1.NotFoundException(`Cryptographic key record ${id} was not found`);
        }
        const now = new Date().toISOString();
        const updated = {
            ...record,
            status,
            activatedAt: status === "active"
                ? record.activatedAt ?? now
                : record.activatedAt,
            retiredAt: status === "retired"
                ? now
                : record.retiredAt,
            revokedAt: status === "revoked"
                ? now
                : record.revokedAt,
            updatedAt: now,
        };
        await this.storage.replaceById(this.collection, id, updated);
        return updated;
    }
    async evaluateRotationDue() {
        const records = await this.list();
        const now = new Date();
        let changed = false;
        const updatedRecords = records.map((record) => {
            if (record.status === "active" &&
                record.rotationDueAt &&
                new Date(record.rotationDueAt).getTime() <=
                    now.getTime()) {
                changed = true;
                return {
                    ...record,
                    status: "rotation_due",
                    updatedAt: now.toISOString(),
                };
            }
            return record;
        });
        if (changed) {
            await this.storage.writeCollection(this.collection, updatedRecords);
        }
        return {
            evaluated: updatedRecords.length,
            rotationDue: updatedRecords.filter((record) => record.status === "rotation_due").length,
            records: updatedRecords.filter((record) => record.status === "rotation_due"),
        };
    }
    async seedDefaults() {
        const records = await this.list();
        if (records.some((record) => record.keyAlias === "avos-signing-primary")) {
            return {
                created: 0,
                total: records.length,
            };
        }
        const activatedAt = new Date();
        const rotationDueAt = new Date(activatedAt.getTime() +
            90 * 24 * 60 * 60 * 1000);
        await this.register({
            keyAlias: "avos-signing-primary",
            purpose: "Digital signatures for AVOS security and compliance evidence",
            algorithm: "RSA-SHA256",
            provider: "AVOS Managed Cryptography",
            status: "active",
            activatedAt: activatedAt.toISOString(),
            rotationDueAt: rotationDueAt.toISOString(),
            metadata: {
                managed: true,
                exportable: false,
            },
        });
        return {
            created: 1,
            total: records.length + 1,
        };
    }
    createMetadataFingerprint(alias, algorithm, version) {
        return (0, node_crypto_1.createHash)("sha256")
            .update(`${alias}:${algorithm}:${version}:${Date.now()}`)
            .digest("hex");
    }
};
exports.KeyLifecycleService = KeyLifecycleService;
exports.KeyLifecycleService = KeyLifecycleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [assurance_storage_service_1.AssuranceStorageService])
], KeyLifecycleService);
//# sourceMappingURL=key-lifecycle.service.js.map