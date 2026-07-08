import { DiscountType, PaymentPlanType } from '../constants/sales.enums';
export declare class CreateQuoteDto {
    vehicleId: number;
    customerId?: number;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    basePrice: number;
    discountType?: DiscountType;
    discountValue?: number;
    taxRate?: number;
    fees?: number;
    paymentPlanType?: PaymentPlanType;
    validityDays?: number;
    notes?: string;
}
