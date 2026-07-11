export declare class QuoteToSalesOrderPolicy {
    ensureHasCustomer(customerId: string | null): void;
    ensureNotConverted(order: unknown): void;
    ensureConvertible(status: string): void;
}
