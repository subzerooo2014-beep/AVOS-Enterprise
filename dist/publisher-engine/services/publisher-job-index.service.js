"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobIndexService = void 0;
const common_1 = require("@nestjs/common");
let PublisherJobIndexService = class PublisherJobIndexService {
    constructor() {
        this.index = new Map();
    }
    put(job) {
        this.index.set(job.id, job);
    }
    get(id) {
        return this.index.get(id);
    }
    has(id) {
        return this.index.has(id);
    }
    remove(id) {
        this.index.delete(id);
    }
    count() {
        return this.index.size;
    }
    values() {
        return [...this.index.values()];
    }
};
exports.PublisherJobIndexService = PublisherJobIndexService;
exports.PublisherJobIndexService = PublisherJobIndexService = __decorate([
    (0, common_1.Injectable)()
], PublisherJobIndexService);
//# sourceMappingURL=publisher-job-index.service.js.map