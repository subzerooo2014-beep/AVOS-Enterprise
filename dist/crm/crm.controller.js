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
exports.CrmController = void 0;
const common_1 = require("@nestjs/common");
const crm_service_1 = require("./crm.service");
const create_crm_dto_1 = require("./dto/create-crm.dto");
const update_crm_dto_1 = require("./dto/update-crm.dto");
const bulk_crm_dto_1 = require("./dto/bulk-crm.dto");
const crm_activity_dto_1 = require("./dto/crm-activity.dto");
const crm_followup_dto_1 = require("./dto/crm-followup.dto");
const crm_convert_sale_dto_1 = require("./dto/crm-convert-sale.dto");
const crm_merge_dto_1 = require("./dto/crm-merge.dto");
const crm_note_dto_1 = require("./dto/crm-note.dto");
let CrmController = class CrmController {
    constructor(service) {
        this.service = service;
    }
    findAll(query) {
        return this.service.findAll(query);
    }
    dashboard() {
        return this.service.dashboard();
    }
    pipeline() {
        return this.service.pipeline();
    }
    segments() {
        return this.service.segments();
    }
    duplicates() {
        return this.service.duplicates();
    }
    dataQuality() {
        return this.service.dataQuality();
    }
    automationQueue() {
        return this.service.automationQueue();
    }
    forecast() {
        return this.service.forecast();
    }
    overdueFollowUps() {
        return this.service.overdueFollowUps();
    }
    exportRows(query) {
        return this.service.exportRows(query);
    }
    importRows(rows) {
        return this.service.importRows(rows);
    }
    bulkStatus(dto) {
        return this.service.bulkStatus(dto);
    }
    bulkAssign(dto) {
        return this.service.bulkAssign(dto);
    }
    merge(dto) {
        return this.service.merge(dto);
    }
    customer360(id) {
        return this.service.customer360(id);
    }
    findOne(id) {
        return this.service.findOne(id);
    }
    create(dto) {
        return this.service.create(dto);
    }
    update(id, dto) {
        return this.service.update(id, dto);
    }
    changeStatus(id, status) {
        return this.service.changeStatus(id, status);
    }
    assign(id, assignedToId) {
        return this.service.assign(id, assignedToId);
    }
    scheduleFollowUp(id, dto) {
        return this.service.scheduleFollowUp(id, dto.nextFollowUpAt);
    }
    addActivity(id, dto) {
        return this.service.addActivity(id, dto);
    }
    addNote(id, dto) {
        return this.service.addNote(id, dto.note);
    }
    convertToSale(id, dto) {
        return this.service.convertToSale(id, dto);
    }
    remove(id) {
        return this.service.remove(id);
    }
};
exports.CrmController = CrmController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)("pipeline"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "pipeline", null);
__decorate([
    (0, common_1.Get)("segments"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "segments", null);
__decorate([
    (0, common_1.Get)("duplicates"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "duplicates", null);
__decorate([
    (0, common_1.Get)("data-quality"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "dataQuality", null);
__decorate([
    (0, common_1.Get)("automation-queue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "automationQueue", null);
__decorate([
    (0, common_1.Get)("forecast"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "forecast", null);
__decorate([
    (0, common_1.Get)("follow-ups/overdue"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "overdueFollowUps", null);
__decorate([
    (0, common_1.Get)("export"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "exportRows", null);
__decorate([
    (0, common_1.Post)("import"),
    __param(0, (0, common_1.Body)("rows")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "importRows", null);
__decorate([
    (0, common_1.Post)("bulk/status"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_crm_dto_1.BulkCrmDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "bulkStatus", null);
__decorate([
    (0, common_1.Post)("bulk/assign"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_crm_dto_1.BulkCrmDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "bulkAssign", null);
__decorate([
    (0, common_1.Post)("merge"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crm_merge_dto_1.CrmMergeDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "merge", null);
__decorate([
    (0, common_1.Get)(":id/customer-360"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "customer360", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_crm_dto_1.CreateCrmDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_crm_dto_1.UpdateCrmDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "changeStatus", null);
__decorate([
    (0, common_1.Post)(":id/assign"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("assignedToId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "assign", null);
__decorate([
    (0, common_1.Post)(":id/follow-up"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, crm_followup_dto_1.CrmFollowUpDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "scheduleFollowUp", null);
__decorate([
    (0, common_1.Post)(":id/activity"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, crm_activity_dto_1.CrmActivityDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "addActivity", null);
__decorate([
    (0, common_1.Post)(":id/note"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, crm_note_dto_1.CrmNoteDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "addNote", null);
__decorate([
    (0, common_1.Post)(":id/convert-to-sale"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, crm_convert_sale_dto_1.CrmConvertSaleDto]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "convertToSale", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CrmController.prototype, "remove", null);
exports.CrmController = CrmController = __decorate([
    (0, common_1.Controller)("crm"),
    __metadata("design:paramtypes", [crm_service_1.CrmService])
], CrmController);
//# sourceMappingURL=crm.controller.js.map