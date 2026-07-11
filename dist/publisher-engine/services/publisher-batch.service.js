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
exports.PublisherBatchService = void 0;
const common_1 = require("@nestjs/common");
const publisher_job_writer_service_1 = require("./publisher-job-writer.service");
let PublisherBatchService = class PublisherBatchService {
    constructor(writer) {
        this.writer = writer;
    }
    async enqueueMany(items) {
        const created = [];
        for (const item of items) {
            created.push(await this.writer.create(item));
        }
        return {
            success: true,
            created: created.length,
            jobs: created,
        };
    }
};
exports.PublisherBatchService = PublisherBatchService;
exports.PublisherBatchService = PublisherBatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_job_writer_service_1.PublisherJobWriterService])
], PublisherBatchService);
//# sourceMappingURL=publisher-batch.service.js.map