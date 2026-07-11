"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherCampaignRouterService = void 0;
const common_1 = require("@nestjs/common");
let PublisherCampaignRouterService = class PublisherCampaignRouterService {
    resolve(campaign) {
        if (!campaign) {
            return "internal";
        }
        if (campaign.export === true) {
            return "gcc_export";
        }
        if (campaign.buyers === true) {
            return "matched_buyers";
        }
        return "website";
    }
};
exports.PublisherCampaignRouterService = PublisherCampaignRouterService;
exports.PublisherCampaignRouterService = PublisherCampaignRouterService = __decorate([
    (0, common_1.Injectable)()
], PublisherCampaignRouterService);
//# sourceMappingURL=publisher-campaign-router.service.js.map