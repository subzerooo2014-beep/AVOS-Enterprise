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
exports.RuntimeIncidentController = void 0;
const common_1 = require("@nestjs/common");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const dto_1 = require("../dto");
const runtime_incident_service_1 = require("../services/runtime-incident.service");
let RuntimeIncidentController = class RuntimeIncidentController {
    constructor(incidents) {
        this.incidents = incidents;
    }
    create(dto) {
        return this.incidents.create(dto);
    }
    list(status, environment, namespace, service) {
        return this.incidents.list({
            status,
            environment,
            namespace,
            service,
        });
    }
    get(id) {
        return this.incidents.get(id);
    }
    update(id, dto) {
        return this.incidents.update(id, dto);
    }
};
exports.RuntimeIncidentController = RuntimeIncidentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateRuntimeIncidentDto]),
    __metadata("design:returntype", void 0)
], RuntimeIncidentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("status")),
    __param(1, (0, common_1.Query)("environment")),
    __param(2, (0, common_1.Query)("namespace")),
    __param(3, (0, common_1.Query)("service")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], RuntimeIncidentController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeIncidentController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateRuntimeIncidentDto]),
    __metadata("design:returntype", void 0)
], RuntimeIncidentController.prototype, "update", null);
exports.RuntimeIncidentController = RuntimeIncidentController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-3/incidents"),
    __metadata("design:paramtypes", [runtime_incident_service_1.RuntimeIncidentService])
], RuntimeIncidentController);
//# sourceMappingURL=runtime-incident.controller.js.map