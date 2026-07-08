"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesaiModule = void 0;
const common_1 = require("@nestjs/common");
const invoicesai_controller_1 = require("./invoicesai.controller");
const invoicesai_service_1 = require("./invoicesai.service");
let InvoicesaiModule = class InvoicesaiModule {
};
exports.InvoicesaiModule = InvoicesaiModule;
exports.InvoicesaiModule = InvoicesaiModule = __decorate([
    (0, common_1.Module)({
        controllers: [invoicesai_controller_1.InvoicesaiController],
        providers: [invoicesai_service_1.InvoicesaiService],
    })
], InvoicesaiModule);
//# sourceMappingURL=invoicesai.module.js.map