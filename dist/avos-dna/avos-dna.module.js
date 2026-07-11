"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvosDnaModule = void 0;
const common_1 = require("@nestjs/common");
const avos_dna_controller_1 = require("./avos-dna.controller");
const avos_dna_service_1 = require("./avos-dna.service");
let AvosDnaModule = class AvosDnaModule {
};
exports.AvosDnaModule = AvosDnaModule;
exports.AvosDnaModule = AvosDnaModule = __decorate([
    (0, common_1.Module)({
        controllers: [avos_dna_controller_1.AvosDnaController],
        providers: [avos_dna_service_1.AvosDnaService],
        exports: [avos_dna_service_1.AvosDnaService],
    })
], AvosDnaModule);
//# sourceMappingURL=avos-dna.module.js.map