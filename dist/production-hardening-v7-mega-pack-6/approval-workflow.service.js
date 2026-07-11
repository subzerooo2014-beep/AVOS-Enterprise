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
exports.ApprovalWorkflowService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const mega_pack_6_constants_1 = require("./constants/mega-pack-6.constants");
const enterprise_sequence_service_1 = require("./enterprise-sequence.service");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
const platform_event_bus_service_1 = require("./platform-event-bus.service");
let ApprovalWorkflowService = class ApprovalWorkflowService {
    constructor(storage, sequence, events) {
        this.storage = storage;
        this.sequence = sequence;
        this.events = events;
    }
    async create(dto) {
        const uniqueApprovers = [
            ...new Set(dto.requiredApprovers),
        ];
        if (dto.minimumApprovals >
            uniqueApprovers.length) {
            throw new common_1.BadRequestException("minimumApprovals cannot exceed the number of required approvers");
        }
        const now = new Date();
        const expiresAt = dto.expiresAt ??
            new Date(now.getTime() +
                mega_pack_6_constants_1.DEFAULT_APPROVAL_EXPIRY_HOURS *
                    60 *
                    60 *
                    1000).toISOString();
        const request = {
            id: (0, node_crypto_1.randomUUID)(),
            requestCode: this.sequence.next(mega_pack_6_constants_1.APPROVAL_CODE_PREFIX),
            title: dto.title,
            description: dto.description,
            requestType: dto.requestType,
            requestedBy: dto.requestedBy,
            requiredApprovers: uniqueApprovers,
            minimumApprovals: dto.minimumApprovals,
            approvals: [],
            decision: "pending",
            expiresAt,
            entityReference: {
                entityType: dto.entityType,
                entityId: dto.entityId,
            },
            metadata: dto.metadata ?? {},
            createdAt: now.toISOString(),
            updatedAt: now.toISOString(),
        };
        await this.storage.append(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.approvalRequests, request);
        await this.events.publish({
            eventType: "approval.request.created",
            source: "ApprovalWorkflowService",
            severity: "medium",
            entityType: "approval_request",
            entityId: request.id,
            payload: {
                requestCode: request.requestCode,
                requestType: request.requestType,
                requiredApprovers: request.requiredApprovers,
                minimumApprovals: request.minimumApprovals,
            },
        });
        return request;
    }
    async list(decision) {
        await this.expirePendingRequests();
        const requests = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.approvalRequests);
        return requests
            .filter((request) => !decision ||
            request.decision === decision)
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    async get(id) {
        const request = await this.storage.findById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.approvalRequests, id);
        if (!request) {
            throw new common_1.NotFoundException(`Approval request ${id} was not found`);
        }
        return request;
    }
    async vote(id, dto) {
        const request = await this.get(id);
        if (request.decision !== "pending") {
            throw new common_1.BadRequestException(`Approval request is already ${request.decision}`);
        }
        if (request.expiresAt &&
            new Date(request.expiresAt).getTime() <=
                Date.now()) {
            return this.expireRequest(request);
        }
        if (!request.requiredApprovers.includes(dto.approver)) {
            throw new common_1.BadRequestException(`${dto.approver} is not an authorized approver`);
        }
        if (request.approvals.some((vote) => vote.approver === dto.approver)) {
            throw new common_1.BadRequestException(`${dto.approver} has already voted`);
        }
        const now = new Date().toISOString();
        const approvals = [
            ...request.approvals,
            {
                id: (0, node_crypto_1.randomUUID)(),
                approver: dto.approver,
                decision: dto.decision,
                comment: dto.comment,
                decidedAt: now,
            },
        ];
        const rejected = approvals.some((vote) => vote.decision === "rejected");
        const approvalCount = approvals.filter((vote) => vote.decision === "approved").length;
        let decision = "pending";
        if (rejected) {
            decision = "rejected";
        }
        else if (approvalCount >=
            request.minimumApprovals) {
            decision = "approved";
        }
        const updated = {
            ...request,
            approvals,
            decision,
            decidedAt: decision !== "pending"
                ? now
                : undefined,
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.approvalRequests, id, updated);
        await this.events.publish({
            eventType: decision === "pending"
                ? "approval.vote.recorded"
                : `approval.request.${decision}`,
            source: "ApprovalWorkflowService",
            severity: decision === "rejected"
                ? "high"
                : "medium",
            entityType: "approval_request",
            entityId: id,
            payload: {
                approver: dto.approver,
                vote: dto.decision,
                finalDecision: decision,
                approvalCount,
            },
        });
        return updated;
    }
    async cancel(id, actor) {
        const request = await this.get(id);
        if (request.decision !== "pending") {
            throw new common_1.BadRequestException("Only pending approval requests can be cancelled");
        }
        const now = new Date().toISOString();
        const updated = {
            ...request,
            decision: "cancelled",
            decidedAt: now,
            updatedAt: now,
            metadata: {
                ...request.metadata,
                cancelledBy: actor,
            },
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.approvalRequests, id, updated);
        return updated;
    }
    async expirePendingRequests() {
        const requests = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.approvalRequests);
        let expired = 0;
        const now = new Date().toISOString();
        const updated = requests.map((request) => {
            if (request.decision === "pending" &&
                request.expiresAt &&
                new Date(request.expiresAt).getTime() <= Date.now()) {
                expired += 1;
                return {
                    ...request,
                    decision: "expired",
                    decidedAt: now,
                    updatedAt: now,
                };
            }
            return request;
        });
        if (expired > 0) {
            await this.storage.writeCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.approvalRequests, updated);
        }
        return {
            evaluated: requests.length,
            expired,
        };
    }
    async expireRequest(request) {
        const now = new Date().toISOString();
        const updated = {
            ...request,
            decision: "expired",
            decidedAt: now,
            updatedAt: now,
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.approvalRequests, request.id, updated);
        return updated;
    }
};
exports.ApprovalWorkflowService = ApprovalWorkflowService;
exports.ApprovalWorkflowService = ApprovalWorkflowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mega_pack_6_storage_service_1.MegaPack6StorageService,
        enterprise_sequence_service_1.EnterpriseSequenceService,
        platform_event_bus_service_1.PlatformEventBusService])
], ApprovalWorkflowService);
//# sourceMappingURL=approval-workflow.service.js.map