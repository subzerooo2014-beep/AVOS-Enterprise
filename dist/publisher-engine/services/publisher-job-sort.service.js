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
exports.PublisherJobSortService = void 0;
const common_1 = require("@nestjs/common");
const publisher_job_priority_service_1 = require("./publisher-job-priority.service");
let PublisherJobSortService = class PublisherJobSortService {
    constructor(priority) {
        this.priority = priority;
    }
    sort(jobs) {
        return [...jobs].sort((a, b) => this.priority.calculate(b) - this.priority.calculate(a));
    }
};
exports.PublisherJobSortService = PublisherJobSortService;
exports.PublisherJobSortService = PublisherJobSortService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_job_priority_service_1.PublisherJobPriorityService])
], PublisherJobSortService);
//# sourceMappingURL=publisher-job-sort.service.js.map