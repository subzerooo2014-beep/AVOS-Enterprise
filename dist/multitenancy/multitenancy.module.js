"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultitenancyModule = void 0;
const common_1 = require("@nestjs/common");
const multitenancy_controller_1 = require("./multitenancy.controller");
const multitenancy_service_1 = require("./multitenancy.service");
let MultitenancyModule = class MultitenancyModule {
};
exports.MultitenancyModule = MultitenancyModule;
exports.MultitenancyModule = MultitenancyModule = __decorate([
    (0, common_1.Module)({
        controllers: [multitenancy_controller_1.MultitenancyController],
        providers: [multitenancy_service_1.MultitenancyService],
    })
], MultitenancyModule);
//# sourceMappingURL=multitenancy.module.js.map