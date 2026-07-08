"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSalesPricing = calculateSalesPricing;
const common_1 = require("@nestjs/common");
const sales_enums_1 = require("../constants/sales.enums");
const money_helper_1 = require("./money.helper");
function calculateSalesPricing(input) {
    const basePrice = (0, money_helper_1.safeNumber)(input.basePrice);
    const discountValue = (0, money_helper_1.safeNumber)(input.discountValue);
    const taxRate = (0, money_helper_1.safeNumber)(input.taxRate);
    const fees = (0, money_helper_1.safeNumber)(input.fees);
    if (basePrice < 0)
        throw new common_1.BadRequestException('basePrice must not be negative');
    if (discountValue < 0)
        throw new common_1.BadRequestException('discountValue must not be negative');
    if (taxRate < 0)
        throw new common_1.BadRequestException('taxRate must not be negative');
    if (fees < 0)
        throw new common_1.BadRequestException('fees must not be negative');
    let discountAmount = 0;
    if (input.discountType === sales_enums_1.DiscountType.PERCENTAGE) {
        if (discountValue > 100) {
            throw new common_1.BadRequestException('percentage discount cannot exceed 100');
        }
        discountAmount = basePrice * (discountValue / 100);
    }
    if (input.discountType === sales_enums_1.DiscountType.FIXED) {
        discountAmount = discountValue;
    }
    if (discountAmount > basePrice) {
        throw new common_1.BadRequestException('discount cannot exceed base price');
    }
    const taxableAmount = basePrice - discountAmount;
    const taxAmount = taxableAmount * (taxRate / 100);
    const totalAmount = taxableAmount + taxAmount + fees;
    return {
        basePrice: (0, money_helper_1.toMoney)(basePrice),
        discountAmount: (0, money_helper_1.toMoney)(discountAmount),
        taxableAmount: (0, money_helper_1.toMoney)(taxableAmount),
        taxAmount: (0, money_helper_1.toMoney)(taxAmount),
        fees: (0, money_helper_1.toMoney)(fees),
        totalAmount: (0, money_helper_1.toMoney)(totalAmount),
    };
}
//# sourceMappingURL=sales-pricing.helper.js.map