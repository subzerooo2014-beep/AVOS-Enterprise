"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealerportalModule = void 0;
const common_1 = require("@nestjs/common");
const dealerportal_controller_1 = require("./dealerportal.controller");
const dealerportal_service_1 = require("./dealerportal.service");
let DealerportalModule = class DealerportalModule {
};
exports.DealerportalModule = DealerportalModule;
exports.DealerportalModule = DealerportalModule = __decorate([
    (0, common_1.Module)({
        controllers: [dealerportal_controller_1.DealerportalController],
        providers: [dealerportal_service_1.DealerportalService],
    })
], DealerportalModule);
//# sourceMappingURL=dealerportal.module.js.map