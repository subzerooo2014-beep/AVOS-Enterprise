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
exports.RuntimeExecutionLockService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
let RuntimeExecutionLockService = class RuntimeExecutionLockService {
    constructor(store) {
        this.store = store;
    }
    acquire(dto) {
        this.expireLocks();
        const conflict = this.store
            .listExecutionLocks()
            .find((lock) => lock.status ===
            contracts_1.RuntimeLockStatus.ACTIVE &&
            lock.key === dto.key);
        if (conflict) {
            throw new common_1.BadRequestException(`Runtime lock already exists for key ${dto.key}`);
        }
        const acquiredAt = new Date().toISOString();
        const expiresAt = new Date(Date.now() +
            dto.ttlSeconds * 1000).toISOString();
        const lock = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            type: dto.type,
            status: contracts_1.RuntimeLockStatus.ACTIVE,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            resourceId: dto.resourceId,
            changeExecutionId: dto.changeExecutionId,
            owner: dto.actor,
            acquiredAt,
            expiresAt,
            metadata: (dto.metadata ?? {}),
        };
        return this.store
            .saveExecutionLock(lock);
    }
    release(id, dto) {
        const lock = this.get(id);
        if (lock.status !==
            contracts_1.RuntimeLockStatus.ACTIVE) {
            throw new common_1.BadRequestException(`Runtime lock is not active. Current status: ${lock.status}`);
        }
        lock.status =
            contracts_1.RuntimeLockStatus.RELEASED;
        lock.releasedAt =
            new Date().toISOString();
        lock.releaseReason =
            dto.reason;
        lock.metadata = {
            ...lock.metadata,
            releasedBy: dto.actor.id,
        };
        return this.store
            .saveExecutionLock(lock);
    }
    forceRelease(id, dto) {
        const lock = this.get(id);
        lock.status =
            contracts_1.RuntimeLockStatus.FORCE_RELEASED;
        lock.releasedAt =
            new Date().toISOString();
        lock.releaseReason =
            dto.reason;
        lock.metadata = {
            ...lock.metadata,
            forceReleasedBy: dto.actor.id,
        };
        return this.store
            .saveExecutionLock(lock);
    }
    list() {
        this.expireLocks();
        return this.store
            .listExecutionLocks();
    }
    get(id) {
        const lock = this.store
            .getExecutionLock(id);
        if (!lock) {
            throw new common_1.NotFoundException(`Runtime execution lock ${id} was not found`);
        }
        return lock;
    }
    expireLocks() {
        const now = Date.now();
        for (const lock of this.store
            .listExecutionLocks()) {
            if (lock.status ===
                contracts_1.RuntimeLockStatus.ACTIVE &&
                new Date(lock.expiresAt).getTime() <= now) {
                lock.status =
                    contracts_1.RuntimeLockStatus.EXPIRED;
                lock.releasedAt =
                    new Date().toISOString();
                lock.releaseReason =
                    "Lock TTL expired";
                this.store
                    .saveExecutionLock(lock);
            }
        }
    }
};
exports.RuntimeExecutionLockService = RuntimeExecutionLockService;
exports.RuntimeExecutionLockService = RuntimeExecutionLockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore])
], RuntimeExecutionLockService);
//# sourceMappingURL=runtime-execution-lock.service.js.map