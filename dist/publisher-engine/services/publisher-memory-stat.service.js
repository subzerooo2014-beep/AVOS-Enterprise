"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherMemoryStatService = void 0;
const common_1 = require("@nestjs/common");
let PublisherMemoryStatService = class PublisherMemoryStatService {
    usage() {
        const memory = process.memoryUsage();
        return {
            rss: memory.rss,
            heapUsed: memory.heapUsed,
            heapTotal: memory.heapTotal,
            external: memory.external,
            arrayBuffers: memory.arrayBuffers,
            generatedAt: new Date(),
        };
    }
};
exports.PublisherMemoryStatService = PublisherMemoryStatService;
exports.PublisherMemoryStatService = PublisherMemoryStatService = __decorate([
    (0, common_1.Injectable)()
], PublisherMemoryStatService);
//# sourceMappingURL=publisher-memory-stat.service.js.map