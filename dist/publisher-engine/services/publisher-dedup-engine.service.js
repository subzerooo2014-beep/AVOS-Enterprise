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
exports.PublisherDedupEngineService = void 0;
const common_1 = require("@nestjs/common");
const publisher_job_deduplication_service_1 = require("./publisher-job-deduplication.service");
const publisher_job_fingerprint_service_1 = require("./publisher-job-fingerprint.service");
let PublisherDedupEngineService = class PublisherDedupEngineService {
    constructor(dedup, fingerprint) {
        this.dedup = dedup;
        this.fingerprint = fingerprint;
    }
    check(job) {
        const key = this.fingerprint.make(job);
        if (this.dedup.exists(key)) {
            return {
                duplicate: true,
                key,
            };
        }
        this.dedup.register(key);
        return {
            duplicate: false,
            key,
        };
    }
};
exports.PublisherDedupEngineService = PublisherDedupEngineService;
exports.PublisherDedupEngineService = PublisherDedupEngineService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_job_deduplication_service_1.PublisherJobDeduplicationService,
        publisher_job_fingerprint_service_1.PublisherJobFingerprintService])
], PublisherDedupEngineService);
//# sourceMappingURL=publisher-dedup-engine.service.js.map