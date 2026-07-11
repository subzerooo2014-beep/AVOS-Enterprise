"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BuyerMatchingModule = void 0;
const common_1 = require("@nestjs/common");
const buyer_matching_controller_1 = require("./buyer-matching.controller");
const buyer_matching_service_1 = require("./buyer-matching.service");
let BuyerMatchingModule = class BuyerMatchingModule {
};
exports.BuyerMatchingModule = BuyerMatchingModule;
exports.BuyerMatchingModule = BuyerMatchingModule = __decorate([
    (0, common_1.Module)({
        controllers: [buyer_matching_controller_1.BuyerMatchingController],
        providers: [buyer_matching_service_1.BuyerMatchingService],
        exports: [buyer_matching_service_1.BuyerMatchingService],
    })
], BuyerMatchingModule);
//# sourceMappingURL=buyer-matching.module.js.map