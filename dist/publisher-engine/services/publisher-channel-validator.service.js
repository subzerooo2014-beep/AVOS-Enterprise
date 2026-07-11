"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherChannelValidatorService = void 0;
const common_1 = require("@nestjs/common");
const publisher_channel_util_1 = require("../utils/publisher-channel.util");
let PublisherChannelValidatorService = class PublisherChannelValidatorService {
    validate(channel) {
        return {
            valid: publisher_channel_util_1.PublisherChannelUtil.exists(channel),
            channel: publisher_channel_util_1.PublisherChannelUtil.fallback(channel),
        };
    }
};
exports.PublisherChannelValidatorService = PublisherChannelValidatorService;
exports.PublisherChannelValidatorService = PublisherChannelValidatorService = __decorate([
    (0, common_1.Injectable)()
], PublisherChannelValidatorService);
//# sourceMappingURL=publisher-channel-validator.service.js.map