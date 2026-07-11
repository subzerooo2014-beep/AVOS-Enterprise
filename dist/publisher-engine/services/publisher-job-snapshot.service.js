"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobSnapshotService = void 0;
const common_1 = require("@nestjs/common");
let PublisherJobSnapshotService = class PublisherJobSnapshotService {
    snapshot(job) {
        return {
            id: job.id,
            title: job.title,
            status: job.status,
            priority: job.priority,
            retryCount: job.retryCount,
            workerId: job.workerId,
            lockedAt: job.lockedAt,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
        };
    }
};
exports.PublisherJobSnapshotService = PublisherJobSnapshotService;
exports.PublisherJobSnapshotService = PublisherJobSnapshotService = __decorate([
    (0, common_1.Injectable)()
], PublisherJobSnapshotService);
//# sourceMappingURL=publisher-job-snapshot.service.js.map