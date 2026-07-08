export declare class CreateInvoiceDto {
    saleId?: string;
    customerId?: string;
    amount: number;
    taxAmount?: number;
    discountAmount?: number;
    dueDate?: string;
    notes?: string;
}
