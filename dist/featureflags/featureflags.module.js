"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureflagsModule = void 0;
const common_1 = require("@nestjs/common");
const featureflags_controller_1 = require("./featureflags.controller");
const featureflags_service_1 = require("./featureflags.service");
let FeatureflagsModule = class FeatureflagsModule {
};
exports.FeatureflagsModule = FeatureflagsModule;
exports.FeatureflagsModule = FeatureflagsModule = __decorate([
    (0, common_1.Module)({
        controllers: [featureflags_controller_1.FeatureflagsController],
        providers: [featureflags_service_1.FeatureflagsService],
    })
], FeatureflagsModule);
//# sourceMappingURL=featureflags.module.js.map