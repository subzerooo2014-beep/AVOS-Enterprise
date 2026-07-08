"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseOrderStatus = exports.SupplierStatus = void 0;
var SupplierStatus;
(function (SupplierStatus) {
    SupplierStatus["ACTIVE"] = "ACTIVE";
    SupplierStatus["INACTIVE"] = "INACTIVE";
    SupplierStatus["BLOCKED"] = "BLOCKED";
})(SupplierStatus || (exports.SupplierStatus = SupplierStatus = {}));
var PurchaseOrderStatus;
(function (PurchaseOrderStatus) {
    PurchaseOrderStatus["DRAFT"] = "DRAFT";
    PurchaseOrderStatus["SENT"] = "SENT";
    PurchaseOrderStatus["APPROVED"] = "APPROVED";
    PurchaseOrderStatus["RECEIVED"] = "RECEIVED";
    PurchaseOrderStatus["CANCELLED"] = "CANCELLED";
})(PurchaseOrderStatus || (exports.PurchaseOrderStatus = PurchaseOrderStatus = {}));
//# sourceMappingURL=procurement.enums.js.map