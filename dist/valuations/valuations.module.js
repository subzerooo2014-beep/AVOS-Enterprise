"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValuationsModule = void 0;
const common_1 = require("@nestjs/common");
const valuations_controller_1 = require("./valuations.controller");
const valuations_service_1 = require("./valuations.service");
let ValuationsModule = class ValuationsModule {
};
exports.ValuationsModule = ValuationsModule;
exports.ValuationsModule = ValuationsModule = __decorate([
    (0, common_1.Module)({
        controllers: [valuations_controller_1.ValuationsController],
        providers: [valuations_service_1.ValuationsService],
    })
], ValuationsModule);
//# sourceMappingURL=valuations.module.js.map