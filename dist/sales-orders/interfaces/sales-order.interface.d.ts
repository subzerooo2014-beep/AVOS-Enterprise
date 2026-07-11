export interface SalesOrderEntity {
    id: string;
    customerId: string;
    status: string;
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
