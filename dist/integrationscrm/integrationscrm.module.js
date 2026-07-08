"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationscrmModule = void 0;
const common_1 = require("@nestjs/common");
const integrationscrm_controller_1 = require("./integrationscrm.controller");
const integrationscrm_service_1 = require("./integrationscrm.service");
let IntegrationscrmModule = class IntegrationscrmModule {
};
exports.IntegrationscrmModule = IntegrationscrmModule;
exports.IntegrationscrmModule = IntegrationscrmModule = __decorate([
    (0, common_1.Module)({
        controllers: [integrationscrm_controller_1.IntegrationscrmController],
        providers: [integrationscrm_service_1.IntegrationscrmService],
    })
], IntegrationscrmModule);
//# sourceMappingURL=integrationscrm.module.js.map