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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceivePaymentController = void 0;
const common_1 = require("@nestjs/common");
const receive_payment_command_1 = require("./dto/receive-payment.command");
const receive_payment_handler_1 = require("./receive-payment.handler");
let ReceivePaymentController = class ReceivePaymentController {
    constructor(handler) {
        this.handler = handler;
    }
    execute(command) {
        return this.handler.execute(command);
    }
};
exports.ReceivePaymentController = ReceivePaymentController;
__decorate([
    (0, common_1.Post)("receive-payment"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [receive_payment_command_1.ReceivePaymentCommand]),
    __metadata("design:returntype", void 0)
], ReceivePaymentController.prototype, "execute", null);
exports.ReceivePaymentController = ReceivePaymentController = __decorate([
    (0, common_1.Controller)("flows/sales"),
    __metadata("design:paramtypes", [receive_payment_handler_1.ReceivePaymentHandler])
], ReceivePaymentController);
//# sourceMappingURL=receive-payment.controller.js.map