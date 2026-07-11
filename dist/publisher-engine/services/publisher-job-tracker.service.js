"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobTrackerService = void 0;
const common_1 = require("@nestjs/common");
let PublisherJobTrackerService = class PublisherJobTrackerService {
    constructor() {
        this.tracker = new Map();
    }
    start(id) {
        this.tracker.set(id, new Date());
    }
    finish(id) {
        const start = this.tracker.get(id);
        this.tracker.delete(id);
        return start
            ? Date.now() - start.getTime()
            : 0;
    }
};
exports.PublisherJobTrackerService = PublisherJobTrackerService;
exports.PublisherJobTrackerService = PublisherJobTrackerService = __decorate([
    (0, common_1.Injectable)()
], PublisherJobTrackerService);
//# sourceMappingURL=publisher-job-tracker.service.js.map