import { DiscountType } from '../constants/sales.enums';
export interface SalesPricingInput {
    basePrice: number;
    discountType?: DiscountType;
    discountValue?: number;
    taxRate?: number;
    fees?: number;
}
export interface SalesPricingResult {
    basePrice: number;
    discountAmount: number;
    taxableAmount: number;
    taxAmount: number;
    fees: number;
    totalAmount: number;
}
export declare function calculateSalesPricing(input: SalesPricingInput): SalesPricingResult;
