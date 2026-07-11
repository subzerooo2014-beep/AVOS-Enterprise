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
exports.WebsitePublisher = void 0;
const common_1 = require("@nestjs/common");
const website_publishing_service_1 = require("../website-runtime/website-publishing.service");
let WebsitePublisher = class WebsitePublisher {
    constructor(runtime) {
        this.runtime = runtime;
        this.channel = "website";
    }
    async health() {
        return "healthy";
    }
    publish(context) {
        return this.runtime.publish(context);
    }
};
exports.WebsitePublisher = WebsitePublisher;
exports.WebsitePublisher = WebsitePublisher = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [website_publishing_service_1.WebsitePublishingService])
], WebsitePublisher);
//# sourceMappingURL=website.publisher.js.map