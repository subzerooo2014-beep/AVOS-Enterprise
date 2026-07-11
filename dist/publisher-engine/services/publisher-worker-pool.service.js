"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherWorkerPoolService = void 0;
const common_1 = require("@nestjs/common");
let PublisherWorkerPoolService = class PublisherWorkerPoolService {
    constructor() {
        this.workers = new Map();
    }
    register(id) {
        this.workers.set(id, new Date());
    }
    heartbeat(id) {
        this.workers.set(id, new Date());
    }
    unregister(id) {
        this.workers.delete(id);
    }
    list() {
        return [...this.workers.entries()].map(([id, lastSeen]) => ({
            id,
            lastSeen,
        }));
    }
};
exports.PublisherWorkerPoolService = PublisherWorkerPoolService;
exports.PublisherWorkerPoolService = PublisherWorkerPoolService = __decorate([
    (0, common_1.Injectable)()
], PublisherWorkerPoolService);
//# sourceMappingURL=publisher-worker-pool.service.js.map