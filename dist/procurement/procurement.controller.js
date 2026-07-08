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
exports.ProcurementController = void 0;
const common_1 = require("@nestjs/common");
const procurement_service_1 = require("./procurement.service");
const create_supplier_dto_1 = require("./create-supplier.dto");
const update_supplier_dto_1 = require("./update-supplier.dto");
const create_purchase_order_dto_1 = require("./create-purchase-order.dto");
const update_purchase_order_dto_1 = require("./update-purchase-order.dto");
let ProcurementController = class ProcurementController {
    constructor(procurementService) {
        this.procurementService = procurementService;
    }
    createSupplier(dto) {
        return this.procurementService.createSupplier(dto);
    }
    findSuppliers() {
        return this.procurementService.findSuppliers();
    }
    findSupplier(id) {
        return this.procurementService.findSupplier(id);
    }
    updateSupplier(id, dto) {
        return this.procurementService.updateSupplier(id, dto);
    }
    deleteSupplier(id) {
        return this.procurementService.deleteSupplier(id);
    }
    createPurchaseOrder(dto) {
        return this.procurementService.createPurchaseOrder(dto);
    }
    findPurchaseOrders() {
        return this.procurementService.findPurchaseOrders();
    }
    findPurchaseOrder(id) {
        return this.procurementService.findPurchaseOrder(id);
    }
    updatePurchaseOrder(id, dto) {
        return this.procurementService.updatePurchaseOrder(id, dto);
    }
    deletePurchaseOrder(id) {
        return this.procurementService.deletePurchaseOrder(id);
    }
};
exports.ProcurementController = ProcurementController;
__decorate([
    (0, common_1.Post)('suppliers'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_supplier_dto_1.CreateSupplierDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createSupplier", null);
__decorate([
    (0, common_1.Get)('suppliers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findSuppliers", null);
__decorate([
    (0, common_1.Get)('suppliers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findSupplier", null);
__decorate([
    (0, common_1.Patch)('suppliers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_supplier_dto_1.UpdateSupplierDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "updateSupplier", null);
__decorate([
    (0, common_1.Delete)('suppliers/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "deleteSupplier", null);
__decorate([
    (0, common_1.Post)('purchase-orders'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_purchase_order_dto_1.CreatePurchaseOrderDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "createPurchaseOrder", null);
__decorate([
    (0, common_1.Get)('purchase-orders'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findPurchaseOrders", null);
__decorate([
    (0, common_1.Get)('purchase-orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "findPurchaseOrder", null);
__decorate([
    (0, common_1.Patch)('purchase-orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_purchase_order_dto_1.UpdatePurchaseOrderDto]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "updatePurchaseOrder", null);
__decorate([
    (0, common_1.Delete)('purchase-orders/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProcurementController.prototype, "deletePurchaseOrder", null);
exports.ProcurementController = ProcurementController = __decorate([
    (0, common_1.Controller)('procurement'),
    __metadata("design:paramtypes", [procurement_service_1.ProcurementService])
], ProcurementController);
//# sourceMappingURL=procurement.controller.js.map