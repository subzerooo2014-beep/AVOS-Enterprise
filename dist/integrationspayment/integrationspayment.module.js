"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationspaymentModule = void 0;
const common_1 = require("@nestjs/common");
const integrationspayment_controller_1 = require("./integrationspayment.controller");
const integrationspayment_service_1 = require("./integrationspayment.service");
let IntegrationspaymentModule = class IntegrationspaymentModule {
};
exports.IntegrationspaymentModule = IntegrationspaymentModule;
exports.IntegrationspaymentModule = IntegrationspaymentModule = __decorate([
    (0, common_1.Module)({
        controllers: [integrationspayment_controller_1.IntegrationspaymentController],
        providers: [integrationspayment_service_1.IntegrationspaymentService],
    })
], IntegrationspaymentModule);
//# sourceMappingURL=integrationspayment.module.js.map