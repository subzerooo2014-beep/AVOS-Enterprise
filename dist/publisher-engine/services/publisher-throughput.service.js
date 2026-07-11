"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublisherThroughputService = void 0;
const common_1 = require("@nestjs/common");
let PublisherThroughputService = class PublisherThroughputService {
    throughput(processed, seconds) {
        if (seconds <= 0) {
            return 0;
        }
        return Number((processed / seconds).toFixed(2));
    }
};
exports.PublisherThroughputService = PublisherThroughputService;
exports.PublisherThroughputService = PublisherThroughputService = __decorate([
    (0, common_1.Injectable)()
], PublisherThroughputService);
//# sourceMappingURL=publisher-throughput.service.js.map