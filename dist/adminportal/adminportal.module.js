"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminportalModule = void 0;
const common_1 = require("@nestjs/common");
const adminportal_controller_1 = require("./adminportal.controller");
const adminportal_service_1 = require("./adminportal.service");
let AdminportalModule = class AdminportalModule {
};
exports.AdminportalModule = AdminportalModule;
exports.AdminportalModule = AdminportalModule = __decorate([
    (0, common_1.Module)({
        controllers: [adminportal_controller_1.AdminportalController],
        providers: [adminportal_service_1.AdminportalService],
    })
], AdminportalModule);
//# sourceMappingURL=adminportal.module.js.map