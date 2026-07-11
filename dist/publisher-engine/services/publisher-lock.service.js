"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherLockService = void 0;
const common_1 = require("@nestjs/common");
const publisher_job_writer_service_1 = require("./publisher-job-writer.service");
const publisher_id_util_1 = require("../utils/publisher-id.util");
const publisher_status_constants_1 = require("../constants/publisher-status.constants");
let PublisherLockService = class PublisherLockService {
    constructor(writer) {
        this.writer = writer;
    }
    async lock(job) {
        const lockToken = (0, publisher_id_util_1.makeLockToken)(job.id);
        return this.writer.update(job.id, {
            status: "processing",
            startedAt: job.startedAt ?? new Date(),
            lockedAt: new Date(),
            lockToken,
            workerId: publisher_status_constants_1.PUBLISHER_WORKER_ID,
            correlationId: job.correlationId ?? `pub_${job.id}_${Date.now()}`,
        });
    }
    async release(id) {
        return this.writer.update(id, {
            lockedAt: null,
            lockToken: null,
            workerId: null,
        });
    }
};
exports.PublisherLockService = PublisherLockService;
exports.PublisherLockService = PublisherLockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_job_writer_service_1.PublisherJobWriterService])
], PublisherLockService);
//# sourceMappingURL=publisher-lock.service.js.map