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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const create_ledger_entry_dto_1 = require("./dto/create-ledger-entry.dto");
let FinanceController = class FinanceController {
    constructor(financeService) {
        this.financeService = financeService;
    }
    createInvoice(dto) {
        return this.financeService.createInvoice(dto);
    }
    listInvoices() {
        return this.financeService.listInvoices();
    }
    getInvoice(id) {
        return this.financeService.getInvoice(id);
    }
    createPayment(dto) {
        return this.financeService.createPayment(dto);
    }
    listPayments() {
        return this.financeService.listPayments();
    }
    createLedgerEntry(dto) {
        return this.financeService.createLedgerEntry(dto);
    }
    listLedger() {
        return this.financeService.listLedger();
    }
    summary() {
        return this.financeService.financeSummary();
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Post)('invoices'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)('invoices'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "listInvoices", null);
__decorate([
    (0, common_1.Get)('invoices/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "getInvoice", null);
__decorate([
    (0, common_1.Post)('payments'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)('payments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "listPayments", null);
__decorate([
    (0, common_1.Post)('ledger'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ledger_entry_dto_1.CreateLedgerEntryDto]),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "createLedgerEntry", null);
__decorate([
    (0, common_1.Get)('ledger'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "listLedger", null);
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FinanceController.prototype, "summary", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('finance'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map