export type SaleStatus = 'OPEN' | 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'WON' | 'LOST' | 'CANCELLED' | 'CLOSED';
export declare class SalesPolicy {
    static ensureExists(sale: any): void;
    static ensureCanUpdate(sale: any): void;
    static ensureCanDelete(sale: any): void;
    static ensureValidStatus(status: SaleStatus): void;
}
