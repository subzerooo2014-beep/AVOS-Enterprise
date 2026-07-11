export declare class ReceivePaymentPolicy {
    ensureInvoicePayable(invoice: {
        status: string;
        balance: number;
    }): void;
    ensureValidAmount(amount: number, balance: number): void;
    calculateAfterPayment(invoice: {
        paidAmount: number;
        balance: number;
    }, amount: number): {
        paidAmount: number;
        balance: number;
        status: string;
    };
}
