export declare class CrmPolicy {
    static ensureExists(record: any): void;
    static ensureCanUpdate(record: any): void;
    static ensureValidStatus(status: string): void;
    static ensureCanDelete(record: any): void;
}
