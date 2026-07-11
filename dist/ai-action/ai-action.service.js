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
exports.AiActionService = void 0;
const common_1 = require("@nestjs/common");
const ai_decision_service_1 = require("../ai-decision/ai-decision.service");
const ai_action_log_service_1 = require("../ai-action-log/ai-action-log.service");
const publish_jobs_service_1 = require("../publish-jobs/publish-jobs.service");
let AiActionService = class AiActionService {
    constructor(decision, log, publishJobs) {
        this.decision = decision;
        this.log = log;
        this.publishJobs = publishJobs;
    }
    async execute(vehicleId) {
        const d = await this.decision.evaluateVehicle(vehicleId);
        const executed = [];
        for (const action of d.actions) {
            switch (action) {
                case "ALLOW_LISTING":
                    await this.publishJobs.create(vehicleId);
                    executed.push("Vehicle published");
                    break;
                case "TRUST_BADGE":
                    executed.push("Trust badge assigned");
                    break;
                case "PROMOTE_TO_MATCHED_BUYERS":
                    executed.push("Buyer matching triggered");
                    break;
                case "START_MARKETING":
                    executed.push("Marketing campaign started");
                    break;
                case "ENABLE_EXPORT":
                    executed.push("Export workflow prepared");
                    break;
            }
            await this.log.write(vehicleId, action, "completed");
        }
        return {
            decision: d.overallDecision,
            actionsExecuted: executed,
            totalActions: executed.length,
            success: true,
        };
    }
};
exports.AiActionService = AiActionService;
exports.AiActionService = AiActionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_decision_service_1.AiDecisionService,
        ai_action_log_service_1.AiActionLogService,
        publish_jobs_service_1.PublishJobsService])
], AiActionService);
//# sourceMappingURL=ai-action.service.js.map