"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherExecutionLogService = void 0;
const common_1 = require("@nestjs/common");
let PublisherExecutionLogService = class PublisherExecutionLogService {
    constructor() {
        this.logs = [];
    }
    write(entry) {
        this.logs.unshift({
            ...entry,
            timestamp: new Date(),
        });
        if (this.logs.length > 1000) {
            this.logs.length = 1000;
        }
    }
    latest(limit = 100) {
        return this.logs.slice(0, limit);
    }
};
exports.PublisherExecutionLogService = PublisherExecutionLogService;
exports.PublisherExecutionLogService = PublisherExecutionLogService = __decorate([
    (0, common_1.Injectable)()
], PublisherExecutionLogService);
//# sourceMappingURL=publisher-execution-log.service.js.map