"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherDispatchMetricsService = void 0;
const common_1 = require("@nestjs/common");
let PublisherDispatchMetricsService = class PublisherDispatchMetricsService {
    constructor() {
        this.dispatched = 0;
        this.failed = 0;
    }
    success() {
        this.dispatched++;
    }
    failure() {
        this.failed++;
    }
    report() {
        return {
            dispatched: this.dispatched,
            failed: this.failed,
            generatedAt: new Date(),
        };
    }
};
exports.PublisherDispatchMetricsService = PublisherDispatchMetricsService;
exports.PublisherDispatchMetricsService = PublisherDispatchMetricsService = __decorate([
    (0, common_1.Injectable)()
], PublisherDispatchMetricsService);
//# sourceMappingURL=publisher-dispatch-metrics.service.js.map