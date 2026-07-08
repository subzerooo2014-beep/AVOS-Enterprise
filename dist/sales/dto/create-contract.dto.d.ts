import { PaymentPlanType } from '../constants/sales.enums';
export declare class CreateContractDto {
    quoteId?: number;
    vehicleId: number;
    customerId?: number;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    totalAmount: number;
    downPayment?: number;
    paymentPlanType?: PaymentPlanType;
    installmentMonths?: number;
    terms?: string;
    notes?: string;
}
