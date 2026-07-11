"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesWorkflowService = void 0;
const common_1 = require("@nestjs/common");
let SalesWorkflowService = class SalesWorkflowService {
    start(referenceId) {
        return {
            event: "QUOTE_CREATED",
            referenceId,
            status: "STARTED",
            timestamp: new Date(),
        };
    }
    moveToOrder(referenceId) {
        return {
            event: "ORDER_CREATED",
            referenceId,
            status: "ORDER_STAGE",
            timestamp: new Date(),
        };
    }
    moveToInvoice(referenceId) {
        return {
            event: "INVOICE_CREATED",
            referenceId,
            status: "INVOICE_STAGE",
            timestamp: new Date(),
        };
    }
};
exports.SalesWorkflowService = SalesWorkflowService;
exports.SalesWorkflowService = SalesWorkflowService = __decorate([
    (0, common_1.Injectable)()
], SalesWorkflowService);
//# sourceMappingURL=sales-workflow.service.js.map