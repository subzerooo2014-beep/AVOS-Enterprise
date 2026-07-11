"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherJobValidatorV2Service = void 0;
const common_1 = require("@nestjs/common");
let PublisherJobValidatorV2Service = class PublisherJobValidatorV2Service {
    validate(job) {
        const errors = [];
        if (!job?.title)
            errors.push("Missing title");
        if (!job?.status)
            errors.push("Missing status");
        if (!job?.priority)
            errors.push("Missing priority");
        return {
            valid: errors.length === 0,
            errors,
        };
    }
};
exports.PublisherJobValidatorV2Service = PublisherJobValidatorV2Service;
exports.PublisherJobValidatorV2Service = PublisherJobValidatorV2Service = __decorate([
    (0, common_1.Injectable)()
], PublisherJobValidatorV2Service);
//# sourceMappingURL=publisher-job-validator-v2.service.js.map