"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobProgressService = void 0;
const common_1 = require("@nestjs/common");
let PublisherJobProgressService = class PublisherJobProgressService {
    progress(job) {
        switch (job.status) {
            case "queued":
                return 10;
            case "processing":
                return 60;
            case "published":
                return 100;
            case "failed":
            case "dead":
                return 0;
            default:
                return 0;
        }
    }
};
exports.PublisherJobProgressService = PublisherJobProgressService;
exports.PublisherJobProgressService = PublisherJobProgressService = __decorate([
    (0, common_1.Injectable)()
], PublisherJobProgressService);
//# sourceMappingURL=publisher-job-progress.service.js.map