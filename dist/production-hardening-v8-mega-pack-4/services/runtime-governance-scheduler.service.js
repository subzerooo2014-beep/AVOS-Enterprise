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
exports.RuntimeGovernanceSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
const runtime_governance_timeline_service_1 = require("./runtime-governance-timeline.service");
let RuntimeGovernanceSchedulerService = class RuntimeGovernanceSchedulerService {
    constructor(store, timeline) {
        this.store = store;
        this.timeline = timeline;
    }
    create(dto) {
        if (!dto.runAt &&
            !dto.intervalSeconds) {
            throw new common_1.BadRequestException("Schedule requires runAt or intervalSeconds");
        }
        const duplicate = this.store
            .listGovernanceSchedules()
            .find((schedule) => schedule.key === dto.key &&
            ![
                contracts_1.GovernanceScheduleStatus.CANCELLED,
                contracts_1.GovernanceScheduleStatus.COMPLETED,
                contracts_1.GovernanceScheduleStatus.EXPIRED,
            ].includes(schedule.status));
        if (duplicate) {
            throw new common_1.BadRequestException(`Active schedule already exists for key ${dto.key}`);
        }
        const now = new Date().toISOString();
        const schedule = {
            id: (0, crypto_1.randomUUID)(),
            key: dto.key,
            name: dto.name,
            description: dto.description,
            type: dto.type,
            status: dto.enabled === false
                ? contracts_1.GovernanceScheduleStatus.PAUSED
                : contracts_1.GovernanceScheduleStatus.ACTIVE,
            environment: dto.environment,
            namespace: dto.namespace,
            service: dto.service,
            targetId: dto.targetId,
            runAt: dto.runAt,
            intervalSeconds: dto.intervalSeconds,
            maximumRuns: dto.maximumRuns,
            runCount: 0,
            retryLimit: dto.retryLimit ?? 0,
            retryDelaySeconds: dto.retryDelaySeconds ?? 0,
            enabled: dto.enabled ?? true,
            payload: (dto.payload ?? {}),
            metadata: (dto.metadata ?? {}),
            createdBy: dto.actor,
            createdAt: now,
            updatedAt: now,
            activatedAt: dto.enabled === false
                ? undefined
                : now,
            expiresAt: dto.expiresAt,
            nextRunAt: this.calculateNextRun(dto.runAt, dto.intervalSeconds, now),
        };
        return this.store
            .saveGovernanceSchedule(schedule);
    }
    list() {
        this.normalizeSchedules();
        return this.store
            .listGovernanceSchedules();
    }
    get(id) {
        const schedule = this.store
            .getGovernanceSchedule(id);
        if (!schedule) {
            throw new common_1.NotFoundException(`Governance schedule ${id} was not found`);
        }
        return schedule;
    }
    updateStatus(id, dto) {
        const schedule = this.get(id);
        const now = new Date().toISOString();
        schedule.status =
            dto.status;
        schedule.updatedAt =
            now;
        schedule.enabled =
            dto.status ===
                contracts_1.GovernanceScheduleStatus.ACTIVE;
        if (dto.status ===
            contracts_1.GovernanceScheduleStatus.ACTIVE) {
            schedule.activatedAt =
                now;
            schedule.nextRunAt =
                this.calculateNextRun(schedule.runAt, schedule.intervalSeconds, now);
        }
        if (dto.status ===
            contracts_1.GovernanceScheduleStatus.PAUSED) {
            schedule.pausedAt =
                now;
        }
        if (dto.status ===
            contracts_1.GovernanceScheduleStatus.CANCELLED) {
            schedule.cancelledAt =
                now;
        }
        schedule.metadata = {
            ...schedule.metadata,
            lastStatusReason: dto.reason,
            lastStatusActorId: dto.actor.id,
        };
        return this.store
            .saveGovernanceSchedule(schedule);
    }
    runDue(actor) {
        this.normalizeSchedules();
        const now = Date.now();
        const due = this.store
            .listGovernanceSchedules()
            .filter((schedule) => schedule.status ===
            contracts_1.GovernanceScheduleStatus.ACTIVE &&
            schedule.enabled &&
            Boolean(schedule.nextRunAt) &&
            new Date(schedule.nextRunAt).getTime() <= now);
        return due.map((schedule) => this.executeSchedule(schedule, actor));
    }
    listRuns() {
        return this.store
            .listGovernanceScheduleRuns();
    }
    executeSchedule(schedule, actor) {
        const run = {
            id: (0, crypto_1.randomUUID)(),
            scheduleId: schedule.id,
            runNumber: schedule.runCount + 1,
            status: contracts_1.GovernanceScheduleRunStatus.RUNNING,
            startedAt: new Date().toISOString(),
            output: {},
        };
        this.store
            .saveGovernanceScheduleRun(run);
        try {
            run.status =
                contracts_1.GovernanceScheduleRunStatus.SUCCEEDED;
            run.output = {
                scheduleType: schedule.type,
                targetId: schedule.targetId ??
                    null,
                payload: schedule.payload,
                executedAt: new Date().toISOString(),
            };
            run.completedAt =
                new Date().toISOString();
            schedule.runCount +=
                1;
            schedule.lastRunAt =
                run.completedAt;
            schedule.updatedAt =
                run.completedAt;
            if (schedule.maximumRuns &&
                schedule.runCount >=
                    schedule.maximumRuns) {
                schedule.status =
                    contracts_1.GovernanceScheduleStatus.COMPLETED;
                schedule.completedAt =
                    run.completedAt;
                schedule.enabled =
                    false;
                schedule.nextRunAt =
                    undefined;
            }
            else {
                schedule.nextRunAt =
                    this.calculateNextRun(undefined, schedule.intervalSeconds, run.completedAt);
                if (!schedule.intervalSeconds) {
                    schedule.status =
                        contracts_1.GovernanceScheduleStatus.COMPLETED;
                    schedule.completedAt =
                        run.completedAt;
                    schedule.enabled =
                        false;
                }
            }
            this.store
                .saveGovernanceSchedule(schedule);
            const savedRun = this.store
                .saveGovernanceScheduleRun(run);
            this.timeline.append({
                aggregateType: "governance_schedule",
                aggregateId: schedule.id,
                type: contracts_1.GovernanceTimelineEventType.SCHEDULE_EXECUTED,
                title: `Schedule executed: ${schedule.name}`,
                description: schedule.description,
                relatedResourceIds: [
                    schedule.targetId,
                    savedRun.id,
                ].filter((value) => Boolean(value)),
                payload: {
                    scheduleId: schedule.id,
                    scheduleRunId: savedRun.id,
                    scheduleType: schedule.type,
                    runNumber: savedRun.runNumber,
                    status: savedRun.status,
                },
                metadata: {},
                actor,
            });
            return savedRun;
        }
        catch (error) {
            run.status =
                contracts_1.GovernanceScheduleRunStatus.FAILED;
            run.completedAt =
                new Date().toISOString();
            run.error =
                error instanceof Error
                    ? error.message
                    : "Unknown schedule failure";
            schedule.status =
                contracts_1.GovernanceScheduleStatus.FAILED;
            schedule.failedAt =
                run.completedAt;
            schedule.lastError =
                run.error;
            schedule.updatedAt =
                run.completedAt;
            this.store
                .saveGovernanceSchedule(schedule);
            return this.store
                .saveGovernanceScheduleRun(run);
        }
    }
    normalizeSchedules() {
        const now = Date.now();
        for (const schedule of this.store
            .listGovernanceSchedules()) {
            if (schedule.expiresAt &&
                schedule.status ===
                    contracts_1.GovernanceScheduleStatus.ACTIVE &&
                new Date(schedule.expiresAt).getTime() <= now) {
                schedule.status =
                    contracts_1.GovernanceScheduleStatus.EXPIRED;
                schedule.enabled =
                    false;
                schedule.updatedAt =
                    new Date().toISOString();
                this.store
                    .saveGovernanceSchedule(schedule);
            }
        }
    }
    calculateNextRun(runAt, intervalSeconds, baseTime) {
        if (runAt) {
            return new Date(runAt).toISOString();
        }
        if (intervalSeconds) {
            return new Date(new Date(baseTime).getTime() +
                intervalSeconds * 1000).toISOString();
        }
        return undefined;
    }
};
exports.RuntimeGovernanceSchedulerService = RuntimeGovernanceSchedulerService;
exports.RuntimeGovernanceSchedulerService = RuntimeGovernanceSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore,
        runtime_governance_timeline_service_1.RuntimeGovernanceTimelineService])
], RuntimeGovernanceSchedulerService);
//# sourceMappingURL=runtime-governance-scheduler.service.js.map