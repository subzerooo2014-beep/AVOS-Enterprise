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
exports.PublisherAutoRoutingService = void 0;
const common_1 = require("@nestjs/common");
const publisher_decision_service_1 = require("./publisher-decision.service");
let PublisherAutoRoutingService = class PublisherAutoRoutingService {
    constructor(decision) {
        this.decision = decision;
    }
    route(job) {
        return {
            channel: this.decision.decide(job),
            generatedAt: new Date(),
        };
    }
};
exports.PublisherAutoRoutingService = PublisherAutoRoutingService;
exports.PublisherAutoRoutingService = PublisherAutoRoutingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_decision_service_1.PublisherDecisionService])
], PublisherAutoRoutingService);
//# sourceMappingURL=publisher-auto-routing.service.js.map