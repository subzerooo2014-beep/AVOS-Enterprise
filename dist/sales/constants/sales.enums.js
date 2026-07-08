"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountType = exports.PaymentPlanType = exports.ContractStatus = exports.QuoteValidityStatus = exports.SalesStatus = void 0;
var SalesStatus;
(function (SalesStatus) {
    SalesStatus["DRAFT"] = "DRAFT";
    SalesStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    SalesStatus["APPROVED"] = "APPROVED";
    SalesStatus["REJECTED"] = "REJECTED";
    SalesStatus["CONVERTED"] = "CONVERTED";
    SalesStatus["CANCELLED"] = "CANCELLED";
})(SalesStatus || (exports.SalesStatus = SalesStatus = {}));
var QuoteValidityStatus;
(function (QuoteValidityStatus) {
    QuoteValidityStatus["VALID"] = "VALID";
    QuoteValidityStatus["EXPIRED"] = "EXPIRED";
    QuoteValidityStatus["USED"] = "USED";
    QuoteValidityStatus["CANCELLED"] = "CANCELLED";
})(QuoteValidityStatus || (exports.QuoteValidityStatus = QuoteValidityStatus = {}));
var ContractStatus;
(function (ContractStatus) {
    ContractStatus["DRAFT"] = "DRAFT";
    ContractStatus["ACTIVE"] = "ACTIVE";
    ContractStatus["SIGNED"] = "SIGNED";
    ContractStatus["CANCELLED"] = "CANCELLED";
    ContractStatus["COMPLETED"] = "COMPLETED";
})(ContractStatus || (exports.ContractStatus = ContractStatus = {}));
var PaymentPlanType;
(function (PaymentPlanType) {
    PaymentPlanType["CASH"] = "CASH";
    PaymentPlanType["INSTALLMENT"] = "INSTALLMENT";
    PaymentPlanType["BANK_FINANCE"] = "BANK_FINANCE";
    PaymentPlanType["LEASING"] = "LEASING";
})(PaymentPlanType || (exports.PaymentPlanType = PaymentPlanType = {}));
var DiscountType;
(function (DiscountType) {
    DiscountType["FIXED"] = "FIXED";
    DiscountType["PERCENTAGE"] = "PERCENTAGE";
})(DiscountType || (exports.DiscountType = DiscountType = {}));
//# sourceMappingURL=sales.enums.js.map