"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobGarbageCollectorService = void 0;
const common_1 = require("@nestjs/common");
const publisher_job_expiration_service_1 = require("./publisher-job-expiration.service");
let PublisherJobGarbageCollectorService = class PublisherJobGarbageCollectorService {
    collect(jobs) {
        return jobs.filter((job) => !this.expired(job));
    }
    expired(job) {
        return new publisher_job_expiration_service_1.PublisherJobExpirationService(new (class {
            age(item) {
                return Date.now() - new Date(item.createdAt).getTime();
            }
        })()).expired(job);
    }
};
exports.PublisherJobGarbageCollectorService = PublisherJobGarbageCollectorService;
exports.PublisherJobGarbageCollectorService = PublisherJobGarbageCollectorService = __decorate([
    (0, common_1.Injectable)()
], PublisherJobGarbageCollectorService);
//# sourceMappingURL=publisher-job-garbage-collector.service.js.map