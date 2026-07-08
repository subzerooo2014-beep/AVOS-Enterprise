import { PurchaseOrderStatus } from './procurement.enums';
declare class PurchaseOrderItemDto {
    itemName: string;
    quantity: number;
    unitPrice: number;
}
export declare class CreatePurchaseOrderDto {
    supplierId: string;
    status?: PurchaseOrderStatus;
    items: PurchaseOrderItemDto[];
}
export {};
