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
exports.ControlSchedulerService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const mega_pack_6_constants_1 = require("./constants/mega-pack-6.constants");
const mega_pack_6_storage_service_1 = require("./mega-pack-6-storage.service");
const platform_event_bus_service_1 = require("./platform-event-bus.service");
let ControlSchedulerService = class ControlSchedulerService {
    constructor(storage, events) {
        this.storage = storage;
        this.events = events;
    }
    async create(dto) {
        const schedules = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.controlSchedules);
        if (schedules.some((schedule) => schedule.scheduleCode ===
            dto.scheduleCode)) {
            throw new common_1.BadRequestException(`Schedule code ${dto.scheduleCode} already exists`);
        }
        const now = new Date().toISOString();
        const schedule = {
            id: (0, node_crypto_1.randomUUID)(),
            scheduleCode: dto.scheduleCode,
            name: dto.name,
            description: dto.description,
            controlType: dto.controlType,
            handler: dto.handler,
            frequency: dto.frequency,
            hour: dto.hour,
            minute: dto.minute,
            dayOfWeek: dto.dayOfWeek,
            dayOfMonth: dto.dayOfMonth,
            enabled: dto.enabled ?? true,
            configuration: dto.configuration ?? {},
            nextRunAt: this.calculateNextRun({
                frequency: dto.frequency,
                hour: dto.hour,
                minute: dto.minute,
                dayOfWeek: dto.dayOfWeek,
                dayOfMonth: dto.dayOfMonth,
            }, new Date()),
            runCount: 0,
            failureCount: 0,
            createdAt: now,
            updatedAt: now,
        };
        schedules.push(schedule);
        await this.storage.writeCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.controlSchedules, schedules);
        return schedule;
    }
    async list() {
        const schedules = await this.storage.readCollection(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.controlSchedules);
        return schedules.sort((a, b) => a.scheduleCode.localeCompare(b.scheduleCode));
    }
    async get(id) {
        const schedule = await this.storage.findById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.controlSchedules, id);
        if (!schedule) {
            throw new common_1.NotFoundException(`Control schedule ${id} was not found`);
        }
        return schedule;
    }
    async runDue() {
        const schedules = await this.list();
        const now = new Date();
        const dueSchedules = schedules.filter((schedule) => schedule.enabled &&
            schedule.frequency !==
                "manual" &&
            schedule.nextRunAt &&
            new Date(schedule.nextRunAt).getTime() <=
                now.getTime());
        const runs = [];
        let completed = 0;
        let failed = 0;
        for (const schedule of dueSchedules) {
            const run = await this.executeSchedule(schedule);
            runs.push(run);
            if (run.status ===
                "completed") {
                completed += 1;
            }
            else if (run.status === "failed") {
                failed += 1;
            }
        }
        return {
            evaluated: schedules.length,
            due: dueSchedules.length,
            completed,
            failed,
            runs,
        };
    }
    async runNow(id) {
        const schedule = await this.get(id);
        return this.executeSchedule(schedule);
    }
    async enable(id, enabled) {
        const schedule = await this.get(id);
        const updated = {
            ...schedule,
            enabled,
            nextRunAt: enabled
                ? this.calculateNextRun(schedule, new Date())
                : schedule.nextRunAt,
            updatedAt: new Date().toISOString(),
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.controlSchedules, id, updated);
        return updated;
    }
    async seedDefaults() {
        const schedules = await this.list();
        const defaults = [
            {
                scheduleCode: "AVOS-SCHEDULE-ASSURANCE-HOURLY",
                name: "Hourly continuous assurance",
                description: "Runs the continuous assurance validation cycle every hour.",
                controlType: "continuous-assurance",
                handler: "run-continuous-assurance",
                frequency: "hourly",
                minute: 0,
                enabled: true,
                configuration: {},
            },
            {
                scheduleCode: "AVOS-SCHEDULE-INTEGRITY-DAILY",
                name: "Daily integrity verification",
                description: "Runs daily platform and evidence integrity verification.",
                controlType: "integrity-verification",
                handler: "verify-integrity",
                frequency: "daily",
                hour: 2,
                minute: 0,
                enabled: true,
                configuration: {},
            },
            {
                scheduleCode: "AVOS-SCHEDULE-EVIDENCE-DAILY",
                name: "Daily evidence chain verification",
                description: "Verifies the automated evidence chain every day.",
                controlType: "evidence-chain",
                handler: "verify-evidence-chain",
                frequency: "daily",
                hour: 3,
                minute: 0,
                enabled: true,
                configuration: {},
            },
            {
                scheduleCode: "AVOS-SCHEDULE-RISK-WEEKLY",
                name: "Weekly enterprise risk review",
                description: "Runs the enterprise risk treatment review workflow weekly.",
                controlType: "risk-treatment",
                handler: "review-enterprise-risks",
                frequency: "weekly",
                dayOfWeek: 1,
                hour: 8,
                minute: 0,
                enabled: true,
                configuration: {},
            },
        ];
        let created = 0;
        for (const dto of defaults) {
            if (schedules.some((schedule) => schedule.scheduleCode ===
                dto.scheduleCode)) {
                continue;
            }
            await this.create(dto);
            created += 1;
        }
        return {
            created,
            total: schedules.length +
                created,
        };
    }
    async executeSchedule(schedule) {
        const started = new Date();
        const run = {
            id: (0, node_crypto_1.randomUUID)(),
            scheduleId: schedule.id,
            scheduleCode: schedule.scheduleCode,
            startedAt: started.toISOString(),
            status: "running",
            handler: schedule.handler,
            createdAt: started.toISOString(),
            updatedAt: started.toISOString(),
        };
        await this.storage.append(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.schedulerRuns, run);
        try {
            const output = await this.executeHandler(schedule.handler, schedule.configuration);
            const completedAt = new Date();
            const completedRun = {
                ...run,
                status: "completed",
                completedAt: completedAt.toISOString(),
                durationMs: completedAt.getTime() -
                    started.getTime(),
                output,
                updatedAt: completedAt.toISOString(),
            };
            await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.schedulerRuns, run.id, completedRun);
            await this.updateScheduleAfterRun(schedule, true, completedAt);
            await this.events.publish({
                eventType: "scheduler.run.completed",
                source: "ControlSchedulerService",
                severity: "low",
                entityType: "scheduler_run",
                entityId: completedRun.id,
                payload: {
                    scheduleCode: schedule.scheduleCode,
                    handler: schedule.handler,
                    durationMs: completedRun.durationMs,
                },
            });
            return completedRun;
        }
        catch (error) {
            const completedAt = new Date();
            const failedRun = {
                ...run,
                status: "failed",
                completedAt: completedAt.toISOString(),
                durationMs: completedAt.getTime() -
                    started.getTime(),
                errorMessage: error instanceof Error
                    ? error.message
                    : "Unknown scheduler error",
                updatedAt: completedAt.toISOString(),
            };
            await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.schedulerRuns, run.id, failedRun);
            await this.updateScheduleAfterRun(schedule, false, completedAt);
            return failedRun;
        }
    }
    async executeHandler(handler, configuration) {
        switch (handler) {
            case "run-continuous-assurance":
                return {
                    assuranceRequested: true,
                    requestedAt: new Date().toISOString(),
                };
            case "verify-integrity":
                return {
                    integrityVerificationRequested: true,
                    requestedAt: new Date().toISOString(),
                };
            case "verify-evidence-chain":
                return {
                    evidenceChainVerificationRequested: true,
                    requestedAt: new Date().toISOString(),
                };
            case "review-enterprise-risks":
                return {
                    riskReviewRequested: true,
                    requestedAt: new Date().toISOString(),
                };
            default:
                return {
                    handler,
                    executed: true,
                    configuration,
                    executedAt: new Date().toISOString(),
                };
        }
    }
    async updateScheduleAfterRun(schedule, success, completedAt) {
        const updated = {
            ...schedule,
            lastRunAt: completedAt.toISOString(),
            nextRunAt: this.calculateNextRun(schedule, completedAt),
            lastRunStatus: success
                ? "completed"
                : "failed",
            runCount: schedule.runCount + 1,
            failureCount: schedule.failureCount +
                (success ? 0 : 1),
            updatedAt: completedAt.toISOString(),
        };
        await this.storage.replaceById(mega_pack_6_constants_1.MEGA_PACK_6_COLLECTIONS.controlSchedules, schedule.id, updated);
    }
    calculateNextRun(schedule, from) {
        if (schedule.frequency ===
            "manual") {
            return undefined;
        }
        const next = new Date(from);
        const minute = schedule.minute ?? 0;
        if (schedule.frequency ===
            "hourly") {
            next.setMinutes(minute, 0, 0);
            if (next.getTime() <=
                from.getTime()) {
                next.setHours(next.getHours() + 1);
            }
            return next.toISOString();
        }
        const hour = schedule.hour ?? 0;
        next.setHours(hour, minute, 0, 0);
        if (schedule.frequency ===
            "daily") {
            if (next.getTime() <=
                from.getTime()) {
                next.setDate(next.getDate() + 1);
            }
            return next.toISOString();
        }
        if (schedule.frequency ===
            "weekly") {
            const targetDay = schedule.dayOfWeek ?? 1;
            let daysAhead = (targetDay -
                next.getDay() +
                7) %
                7;
            if (daysAhead === 0 &&
                next.getTime() <=
                    from.getTime()) {
                daysAhead = 7;
            }
            next.setDate(next.getDate() +
                daysAhead);
            return next.toISOString();
        }
        const dayOfMonth = schedule.dayOfMonth ?? 1;
        next.setDate(Math.min(dayOfMonth, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
        if (next.getTime() <=
            from.getTime()) {
            next.setMonth(next.getMonth() + 1);
            next.setDate(Math.min(dayOfMonth, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
        }
        return next.toISOString();
    }
};
exports.ControlSchedulerService = ControlSchedulerService;
exports.ControlSchedulerService = ControlSchedulerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mega_pack_6_storage_service_1.MegaPack6StorageService,
        platform_event_bus_service_1.PlatformEventBusService])
], ControlSchedulerService);
//# sourceMappingURL=control-scheduler.service.js.map