"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherChannelRouterService = void 0;
const common_1 = require("@nestjs/common");
const publisher_channel_util_1 = require("../utils/publisher-channel.util");
let PublisherChannelRouterService = class PublisherChannelRouterService {
    resolve(input) {
        return publisher_channel_util_1.PublisherChannelUtil.fallback(input);
    }
    website() {
        return this.resolve("website");
    }
    dealer() {
        return this.resolve("dealer_network");
    }
    crm() {
        return this.resolve("crm_leads");
    }
    buyers() {
        return this.resolve("matched_buyers");
    }
    export() {
        return this.resolve("gcc_export");
    }
    internal() {
        return this.resolve("internal");
    }
};
exports.PublisherChannelRouterService = PublisherChannelRouterService;
exports.PublisherChannelRouterService = PublisherChannelRouterService = __decorate([
    (0, common_1.Injectable)()
], PublisherChannelRouterService);
//# sourceMappingURL=publisher-channel-router.service.js.map