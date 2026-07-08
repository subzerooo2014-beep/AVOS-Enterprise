"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationssmsModule = void 0;
const common_1 = require("@nestjs/common");
const integrationssms_controller_1 = require("./integrationssms.controller");
const integrationssms_service_1 = require("./integrationssms.service");
let IntegrationssmsModule = class IntegrationssmsModule {
};
exports.IntegrationssmsModule = IntegrationssmsModule;
exports.IntegrationssmsModule = IntegrationssmsModule = __decorate([
    (0, common_1.Module)({
        controllers: [integrationssms_controller_1.IntegrationssmsController],
        providers: [integrationssms_service_1.IntegrationssmsService],
    })
], IntegrationssmsModule);
//# sourceMappingURL=integrationssms.module.js.map