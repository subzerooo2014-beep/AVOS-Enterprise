"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherRuntimeStatService = void 0;
const common_1 = require("@nestjs/common");
let PublisherRuntimeStatService = class PublisherRuntimeStatService {
    stats() {
        return {
            pid: process.pid,
            uptime: process.uptime(),
            cpu: process.cpuUsage(),
            platform: process.platform,
            node: process.version,
            generatedAt: new Date(),
        };
    }
};
exports.PublisherRuntimeStatService = PublisherRuntimeStatService;
exports.PublisherRuntimeStatService = PublisherRuntimeStatService = __decorate([
    (0, common_1.Injectable)()
], PublisherRuntimeStatService);
//# sourceMappingURL=publisher-runtime-stat.service.js.map