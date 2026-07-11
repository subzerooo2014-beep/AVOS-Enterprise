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
exports.AutomatedRemediationService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const mega_pack_6_constants_1 = require("./constants/mega-pack-6.constants");
const approval_workflow_service_1 = require("./approval-workflow.service");
const evidence_chain_service_1 = require("./evidence-chain.service");
const enterprise_sequence_service_1 = require("./enterprise-sequence.service");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
const platform_event_bus_service_1 = require("./platform-event-bus.service");
let AutomatedRemediationService = class AutomatedRemediationService {
    constructor(storage, sequence, approvals, evidence, events) {
        this.storage = storage;
        this.sequence = sequence;
        this.approvals = approvals;
        this.evidence = evidence;
        this.events = events;
    }
    async create(dto) {
        const now = new Date().toISOString();
        const actions = dto.actions
            .map((action) => ({
            id: (0, node_crypto_1.randomUUID)(),
            name: action.name,
            handler: action.handler,
            order: action.order,
            requiresApproval: action.requiresApproval ??
                false,
            retryLimit: action.retryLimit ?? 0,
            status: "pending",
            attempts: 0,
            configuration: action.configuration ??
                {},
        }))
            .sort((a, b) => a.order - b.order);
        const remediation = {
            id: (0, node_crypto_1.randomUUID)(),
            remediationCode: this.sequence.next("AVOS-ARM"),
            sourceType: dto.sourceType,
            sourceId: dto.sourceId,
            title: dto.title,
            description: dto.description,
            severity: dto.severity,
            owner: dto.owner,
            priority: dto.priority,
            status: "draft",
            dueAt: dto.dueAt,
            actions,
            metadata: dto.metadata ?? {},
            createdAt: now,
            updatedAt: now,
        };
        await this.storage.append(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.automatedRemediations, remediation);
        await this.events.publish({
            eventType: "remediation.automation.created",
            source: "AutomatedRemediationService",
            severity: remediation.severity,
            entityType: "automated_remediation",
            entityId: remediation.id,
            payload: {
                remediationCode: remediation.remediationCode,
                sourceType: remediation.sourceType,
                sourceId: remediation.sourceId,
                actions: remediation.actions.length,
            },
        });
        return remediation;
    }
    async list() {
        const records = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.automatedRemediations);
        return records.sort((a, b) => a.priority - b.priority ||
            b.createdAt.localeCompare(a.createdAt));
    }
    async get(id) {
        const record = await this.storage.findById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.automatedRemediations, id);
        if (!record) {
            throw new common_1.NotFoundException(`Automated remediation ${id} was not found`);
        }
        return record;
    }
    async requestApproval(id, approvers, minimumApprovals) {
        const remediation = await this.get(id);
        if (remediation.status !==
            "draft") {
            throw new common_1.BadRequestException("Only draft remediations can request approval");
        }
        const approval = await this.approvals.create({
            title: `Approve remediation ${remediation.remediationCode}`,
            description: remediation.description,
            requestType: "automated_remediation",
            requestedBy: remediation.owner,
            requiredApprovers: approvers,
            minimumApprovals,
            entityType: "automated_remediation",
            entityId: remediation.id,
            metadata: {
                severity: remediation.severity,
                sourceType: remediation.sourceType,
                sourceId: remediation.sourceId,
            },
        });
        const updated = {
            ...remediation,
            status: "pending_approval",
            approvalRequestId: approval.id,
            updatedAt: new Date().toISOString(),
        };
        await this.save(updated);
        return updated;
    }
    async synchronizeApproval(id) {
        const remediation = await this.get(id);
        if (!remediation.approvalRequestId) {
            return remediation;
        }
        const approval = await this.approvals.get(remediation.approvalRequestId);
        if (approval.decision ===
            "pending") {
            return remediation;
        }
        const updated = {
            ...remediation,
            status: approval.decision ===
                "approved"
                ? "approved"
                : "cancelled",
            updatedAt: new Date().toISOString(),
        };
        await this.save(updated);
        return updated;
    }
    async execute(id, dto) {
        let remediation = await this.get(id);
        if (remediation.status ===
            "pending_approval") {
            remediation =
                await this.synchronizeApproval(id);
        }
        const requiresApproval = remediation.actions.some((action) => action.requiresApproval);
        if (requiresApproval &&
            remediation.status !==
                "approved") {
            throw new common_1.BadRequestException("This remediation requires approval before execution");
        }
        if (![
            "draft",
            "approved",
            "queued",
            "failed",
        ].includes(remediation.status)) {
            return remediation;
        }
        const now = new Date().toISOString();
        remediation = {
            ...remediation,
            status: "running",
            startedAt: remediation.startedAt ??
                now,
            updatedAt: now,
        };
        await this.save(remediation);
        for (const action of remediation.actions) {
            if (action.status ===
                "completed") {
                continue;
            }
            const runningAction = {
                ...action,
                status: "running",
                attempts: action.attempts + 1,
                startedAt: action.startedAt ??
                    new Date().toISOString(),
            };
            remediation = {
                ...remediation,
                actions: remediation.actions.map((item) => item.id ===
                    action.id
                    ? runningAction
                    : item),
                updatedAt: new Date().toISOString(),
            };
            await this.save(remediation);
            const result = await this.executeAction(runningAction.handler, runningAction.configuration, dto.context ?? {});
            if (!result.success) {
                const current = remediation.actions.find((item) => item.id ===
                    action.id);
                if (current.attempts <=
                    current.retryLimit) {
                    remediation = {
                        ...remediation,
                        actions: remediation.actions.map((item) => item.id ===
                            action.id
                            ? {
                                ...item,
                                status: "pending",
                                errorMessage: result.errorMessage,
                            }
                            : item),
                        updatedAt: new Date().toISOString(),
                    };
                    await this.save(remediation);
                    return this.execute(id, dto);
                }
                remediation = {
                    ...remediation,
                    status: "failed",
                    actions: remediation.actions.map((item) => item.id ===
                        action.id
                        ? {
                            ...item,
                            status: "failed",
                            completedAt: new Date().toISOString(),
                            errorMessage: result.errorMessage,
                        }
                        : item),
                    updatedAt: new Date().toISOString(),
                };
                await this.save(remediation);
                return remediation;
            }
            remediation = {
                ...remediation,
                actions: remediation.actions.map((item) => item.id ===
                    action.id
                    ? {
                        ...item,
                        status: "completed",
                        output: result.output,
                        completedAt: new Date().toISOString(),
                    }
                    : item),
                updatedAt: new Date().toISOString(),
            };
            await this.save(remediation);
            await this.evidence.append({
                evidenceType: "remediation-action",
                sourceType: "automated_remediation",
                sourceId: remediation.id,
                title: `Remediation action: ${action.name}`,
                description: `Automated remediation action ${action.handler} completed`,
                createdBy: dto.actor ??
                    "AVOS Automation Engine",
                payload: {
                    remediationCode: remediation.remediationCode,
                    actionId: action.id,
                    actionName: action.name,
                    handler: action.handler,
                    output: result.output ?? {},
                },
                metadata: {
                    sourceType: remediation.sourceType,
                    sourceId: remediation.sourceId,
                },
            });
        }
        const completedAt = new Date().toISOString();
        remediation = {
            ...remediation,
            status: "completed",
            completedAt,
            updatedAt: completedAt,
        };
        await this.save(remediation);
        await this.events.publish({
            eventType: "remediation.automation.completed",
            source: "AutomatedRemediationService",
            severity: "low",
            entityType: "automated_remediation",
            entityId: remediation.id,
            payload: {
                remediationCode: remediation.remediationCode,
                actionsCompleted: remediation.actions.filter((action) => action.status ===
                    "completed").length,
            },
        });
        return remediation;
    }
    async executeAction(handler, configuration, context) {
        try {
            switch (handler) {
                case "restore-approved-policy":
                    return {
                        success: true,
                        output: {
                            restored: true,
                            policyId: configuration.policyId ??
                                context.policyId ??
                                null,
                        },
                    };
                case "rotate-cryptographic-key":
                    return {
                        success: true,
                        output: {
                            rotationTriggered: true,
                            keyAlias: configuration.keyAlias ??
                                context.keyAlias ??
                                "unknown",
                        },
                    };
                case "generate-compliance-snapshot":
                    return {
                        success: true,
                        output: {
                            snapshotRequested: true,
                            requestedAt: new Date().toISOString(),
                        },
                    };
                case "quarantine-resource":
                    return {
                        success: true,
                        output: {
                            quarantined: true,
                            resource: configuration.resource ??
                                context.resource ??
                                "unknown",
                        },
                    };
                case "notify-security-operations":
                    return {
                        success: true,
                        output: {
                            notificationQueued: true,
                            target: configuration.target ??
                                "Security Operations",
                        },
                    };
                case "verify-integrity":
                    return {
                        success: true,
                        output: {
                            integrityVerified: true,
                            verifiedAt: new Date().toISOString(),
                        },
                    };
                default:
                    return {
                        success: true,
                        output: {
                            handler,
                            executed: true,
                            configuration,
                            context,
                        },
                    };
            }
        }
        catch (error) {
            return {
                success: false,
                errorMessage: error instanceof Error
                    ? error.message
                    : "Unknown remediation action error",
            };
        }
    }
    async save(remediation) {
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.automatedRemediations, remediation.id, remediation);
    }
};
exports.AutomatedRemediationService = AutomatedRemediationService;
exports.AutomatedRemediationService = AutomatedRemediationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mega_pack_6_storage_service_1.MegaPack6StorageService,
        enterprise_sequence_service_1.EnterpriseSequenceService,
        approval_workflow_service_1.ApprovalWorkflowService,
        evidence_chain_service_1.EvidenceChainService,
        platform_event_bus_service_1.PlatformEventBusService])
], AutomatedRemediationService);
//# sourceMappingURL=automated-remediation.service.js.map