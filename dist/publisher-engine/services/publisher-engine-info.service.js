"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherEngineInfoService = void 0;
const common_1 = require("@nestjs/common");
let PublisherEngineInfoService = class PublisherEngineInfoService {
    info() {
        return {
            engine: "AVOS Publisher Engine",
            version: "2.0.0",
            mode: "Production",
            build: "Mega Pack 3",
            ready: true,
            generatedAt: new Date(),
        };
    }
};
exports.PublisherEngineInfoService = PublisherEngineInfoService;
exports.PublisherEngineInfoService = PublisherEngineInfoService = __decorate([
    (0, common_1.Injectable)()
], PublisherEngineInfoService);
//# sourceMappingURL=publisher-engine-info.service.js.map