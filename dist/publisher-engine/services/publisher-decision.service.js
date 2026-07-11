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
exports.PublisherDecisionService = void 0;
const common_1 = require("@nestjs/common");
const publisher_country_router_service_1 = require("./publisher-country-router.service");
const publisher_campaign_router_service_1 = require("./publisher-campaign-router.service");
let PublisherDecisionService = class PublisherDecisionService {
    constructor(country, campaign) {
        this.country = country;
        this.campaign = campaign;
    }
    decide(input) {
        if (input?.campaign) {
            return this.campaign.resolve(input.campaign);
        }
        return this.country.resolve(input?.country);
    }
};
exports.PublisherDecisionService = PublisherDecisionService;
exports.PublisherDecisionService = PublisherDecisionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [publisher_country_router_service_1.PublisherCountryRouterService,
        publisher_campaign_router_service_1.PublisherCampaignRouterService])
], PublisherDecisionService);
//# sourceMappingURL=publisher-decision.service.js.map