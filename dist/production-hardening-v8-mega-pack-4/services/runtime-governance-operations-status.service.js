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
exports.RuntimeGovernanceOperationsStatusService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("../contracts");
const runtime_governance_store_1 = require("../stores/runtime-governance.store");
let RuntimeGovernanceOperationsStatusService = class RuntimeGovernanceOperationsStatusService {
    constructor(store) {
        this.store = store;
    }
    snapshot() {
        const schedules = this.store
            .listGovernanceSchedules();
        const runs = this.store
            .listGovernanceScheduleRuns();
        const escalations = this.store
            .listGovernanceEscalations();
        const notifications = this.store
            .listGovernanceNotifications();
        return {
            schedules: schedules.length,
            activeSchedules: schedules.filter((item) => item.status ===
                contracts_1.GovernanceScheduleStatus.ACTIVE).length,
            failedSchedules: schedules.filter((item) => item.status ===
                contracts_1.GovernanceScheduleStatus.FAILED).length,
            scheduleRuns: runs.length,
            failedScheduleRuns: runs.filter((item) => item.status ===
                contracts_1.GovernanceScheduleRunStatus.FAILED).length,
            escalations: escalations.length,
            openEscalations: escalations.filter((item) => [
                contracts_1.GovernanceEscalationStatus.OPEN,
                contracts_1.GovernanceEscalationStatus.ACKNOWLEDGED,
                contracts_1.GovernanceEscalationStatus.IN_PROGRESS,
            ].includes(item.status)).length,
            criticalEscalations: escalations.filter((item) => [
                contracts_1.GovernanceEscalationSeverity.CRITICAL,
                contracts_1.GovernanceEscalationSeverity.EMERGENCY,
            ].includes(item.severity) &&
                ![
                    contracts_1.GovernanceEscalationStatus.RESOLVED,
                    contracts_1.GovernanceEscalationStatus.CANCELLED,
                    contracts_1.GovernanceEscalationStatus.EXPIRED,
                ].includes(item.status)).length,
            notifications: notifications.length,
            pendingNotifications: notifications.filter((item) => [
                contracts_1.GovernanceNotificationStatus.PENDING,
                contracts_1.GovernanceNotificationStatus.QUEUED,
            ].includes(item.status)).length,
            failedNotifications: notifications.filter((item) => item.status ===
                contracts_1.GovernanceNotificationStatus.FAILED).length,
            timelineEvents: this.store
                .listGovernanceTimeline()
                .length,
            generatedAt: new Date().toISOString(),
        };
    }
};
exports.RuntimeGovernanceOperationsStatusService = RuntimeGovernanceOperationsStatusService;
exports.RuntimeGovernanceOperationsStatusService = RuntimeGovernanceOperationsStatusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [runtime_governance_store_1.RuntimeGovernanceStore])
], RuntimeGovernanceOperationsStatusService);
//# sourceMappingURL=runtime-governance-operations-status.service.js.map