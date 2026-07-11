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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidentCommandController = void 0;
const common_1 = require("@nestjs/common");
const add_incident_timeline_dto_1 = require("./dto/add-incident-timeline.dto");
const assign_incident_member_dto_1 = require("./dto/assign-incident-member.dto");
const create_enterprise_incident_dto_1 = require("./dto/create-enterprise-incident.dto");
const create_incident_action_dto_1 = require("./dto/create-incident-action.dto");
const incident_command_service_1 = require("./incident-command.service");
let IncidentCommandController = class IncidentCommandController {
    constructor(incidents) {
        this.incidents = incidents;
    }
    create(dto) {
        return this.incidents.create(dto);
    }
    list(status) {
        return this.incidents.list(status);
    }
    summary() {
        return this.incidents.summary();
    }
    get(id) {
        return this.incidents.get(id);
    }
    updateStatus(id, dto) {
        return this.incidents.updateStatus(id, dto.status, dto.actor ?? "api");
    }
    assignMember(id, dto) {
        return this.incidents.assignMember(id, dto);
    }
    addTimeline(id, dto) {
        return this.incidents.addTimeline(id, dto);
    }
    addAction(id, dto) {
        return this.incidents.addAction(id, dto);
    }
    updateActionStatus(incidentId, actionId, dto) {
        return this.incidents
            .updateActionStatus(incidentId, actionId, dto.status, dto.actor ?? "api");
    }
};
exports.IncidentCommandController = IncidentCommandController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_enterprise_incident_dto_1.CreateEnterpriseIncidentDto]),
    __metadata("design:returntype", void 0)
], IncidentCommandController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncidentCommandController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("summary"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IncidentCommandController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IncidentCommandController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], IncidentCommandController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(":id/team"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assign_incident_member_dto_1.AssignIncidentMemberDto]),
    __metadata("design:returntype", void 0)
], IncidentCommandController.prototype, "assignMember", null);
__decorate([
    (0, common_1.Post)(":id/timeline"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_incident_timeline_dto_1.AddIncidentTimelineDto]),
    __metadata("design:returntype", void 0)
], IncidentCommandController.prototype, "addTimeline", null);
__decorate([
    (0, common_1.Post)(":id/actions"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_incident_action_dto_1.CreateIncidentActionDto]),
    __metadata("design:returntype", void 0)
], IncidentCommandController.prototype, "addAction", null);
__decorate([
    (0, common_1.Patch)(":incidentId/actions/:actionId/status"),
    __param(0, (0, common_1.Param)("incidentId")),
    __param(1, (0, common_1.Param)("actionId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], IncidentCommandController.prototype, "updateActionStatus", null);
exports.IncidentCommandController = IncidentCommandController = __decorate([
    (0, common_1.Controller)("production-hardening-v7/mega-pack-6/incidents"),
    __metadata("design:paramtypes", [incident_command_service_1.IncidentCommandService])
], IncidentCommandController);
//# sourceMappingURL=incident-command.controller.js.map