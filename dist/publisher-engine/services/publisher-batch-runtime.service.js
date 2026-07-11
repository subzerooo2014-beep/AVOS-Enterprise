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
exports.PublisherBatchRuntimeService = void 0;
const common_1 = require("@nestjs/common");
const publisher_batch_dispatch_service_1 = require("./publisher-batch-dispatch.service");
let PublisherBatchRuntimeService = class PublisherBatchRuntimeService {
    constructor(batch) {
        this.batch = batch;
    }
    execute(limit = 100) {
        return this.batch.dispatch(limit);
    }
};
exports.PublisherBatchRuntimeService = PublisherBatchRuntimeService;
exports.PublisherBatchRuntimeService = PublisherBatchRuntimeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_batch_dispatch_service_1.PublisherBatchDispatchService])
], PublisherBatchRuntimeService);
//# sourceMappingURL=publisher-batch-runtime.service.js.map