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
exports.RuntimeSignalController = void 0;
const common_1 = require("@nestjs/common");
const runtime_resilience_enums_1 = require("../contracts/runtime-resilience.enums");
const dto_1 = require("../dto");
const runtime_signal_service_1 = require("../services/runtime-signal.service");
let RuntimeSignalController = class RuntimeSignalController {
    constructor(signals) {
        this.signals = signals;
    }
    record(dto) {
        return this.signals.record(dto);
    }
    list(environment, namespace, service, status) {
        return this.signals.list({
            environment,
            namespace,
            service,
            status,
        });
    }
    summary(environment, namespace, service) {
        return this.signals.summarize({
            environment,
            namespace,
            service,
        });
    }
    get(id) {
        return this.signals.get(id);
    }
};
exports.RuntimeSignalController = RuntimeSignalController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.RecordRuntimeSignalDto]),
    __metadata("design:returntype", void 0)
], RuntimeSignalController.prototype, "record", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("environment")),
    __param(1, (0, common_1.Query)("namespace")),
    __param(2, (0, common_1.Query)("service")),
    __param(3, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], RuntimeSignalController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("summary"),
    __param(0, (0, common_1.Query)("environment")),
    __param(1, (0, common_1.Query)("namespace")),
    __param(2, (0, common_1.Query)("service")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], RuntimeSignalController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RuntimeSignalController.prototype, "get", null);
exports.RuntimeSignalController = RuntimeSignalController = __decorate([
    (0, common_1.Controller)("production-hardening-v8-mega-pack-3/signals"),
    __metadata("design:paramtypes", [runtime_signal_service_1.RuntimeSignalService])
], RuntimeSignalController);
//# sourceMappingURL=runtime-signal.controller.js.map